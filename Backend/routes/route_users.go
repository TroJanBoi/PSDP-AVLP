package routes

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	gomail "gopkg.in/gomail.v2"
)

var resetCodes = make(map[string]struct {
	Code      string
	ExpiresAt time.Time
})

func RegisterUserRoutes(r *gin.Engine) {
	userGroup := r.Group("/users")
	{
		userGroup.GET("", getUsers)
		userGroup.GET("/:id", getUserByID)
		userGroup.POST("", createUser)
		userGroup.PUT("/:id", updateUser)
		userGroup.DELETE("/:id", deleteUser)
		userGroup.POST("/login", loginUser)

		userGroup.POST("/forgot-password", forgotPassword)
		userGroup.POST("/reset-password", resetPassword)
	}
}

func getUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

func createUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

func getUserByID(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func updateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	var input struct {
		Name     string `json:"name"`
		Password string `json:"password"`
		Bio      string `json:"bio"`
		Github   string `json:"github"`
		Youtube  string `json:"youtube"`
		Linkedin string `json:"linkedin"`
		Discord  string `json:"discord"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	updateData := map[string]interface{}{
		"name":     input.Name,
		"password": input.Password,
		"bio":      input.Bio,
		"github":   input.Github,
		"youtube":  input.Youtube,
		"linkedin": input.Linkedin,
		"discord":  input.Discord,
	}
	if err := database.DB.Model(&user).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func deleteUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted user"})
}

func loginUser(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid json data"})
		return
	}

	var user models.User

	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "The username or password is incorrect."})
		return
	}

	if user.Password != input.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "The username or password is incorrect."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    user,
	})
}

func forgotPassword(c *gin.Context) {
	var input struct {
		Username string `json:"username"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The information is incorrect."})
		return
	}

	var user models.User

	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No users found with this email address."})
		return
	}

	code := generateVerificationCode()
	expirationTime := time.Now().Add(2 * time.Minute)

	resetCodes[user.Email] = struct {
		Code      string
		ExpiresAt time.Time
	}{
		Code:      code,
		ExpiresAt: expirationTime,
	}

	// ส่งอีเมล (ที่นี่ใช้ฟังก์ชันจำลอง)
	if err := sendEmail(user.Email, user.Username, code); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to send email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "Password reset email sent.",
		"username": user.Username,
		"email":    user.Email,
		"time":     expirationTime,
	})
}

func resetPassword(c *gin.Context) {
	var input struct {
		Email       string `json:"email"`
		Code        string `json:"code"`
		NewPassword string `json:"new_password"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "The information is incorrect."})
		return
	}

	storedData, exists := resetCodes[input.Email]
	if !exists || storedData.Code != input.Code {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Verification code is invalid."})
		return
	}

	if time.Now().After(storedData.ExpiresAt) {
		delete(resetCodes, input.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Verification code has expired."})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No users found with this email address."})
		return
	}

	user.Password = input.NewPassword
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to update password"})
		return
	}

	delete(resetCodes, input.Email)

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

func loadEnv() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}
}

func generateVerificationCode() string {
	return fmt.Sprintf("%06d", time.Now().UnixNano()%1000000)
}

func sendEmail(email, username, code string) error {
	loadEnv()

	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASSWORD")

	port, err := strconv.Atoi(smtpPort)
	if err != nil {
		return fmt.Errorf("invalid SMTP port: %v", err)
	}

	m := gomail.NewMessage()
	m.SetHeader("From", smtpUser)
	m.SetHeader("To", email)
	m.SetHeader("Subject", "รหัสยืนยันรีเซ็ตรหัสผ่าน / Reset Password")

	htmlContent := `
	<!DOCTYPE html>
	<html>
	<head>
	<meta charset="UTF-8">
	<title>รีเซ็ตรหัสผ่าน / Reset Password</title>
	<style>
		body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
		.container { max-width: 600px; margin: 50px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
		.header { text-align: center; padding: 10px 0; }
		.code { font-size: 24px; font-weight: bold; color: #333; text-align: center; margin: 20px 0; }
		.footer { text-align: center; font-size: 12px; color: #999; }
	</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h2>Assembly Visual Learning Platform</h2>
				<h2>รีเซ็ตรหัสผ่าน / Reset Password</h2>
			</div>
			<p>สวัสดี, ` + username + `</p>
			<p>Hello, ` + username + `</p>
			<p>เพื่อรีเซ็ตรหัสผ่านของคุณ กรุณาใช้รหัสยืนยันด้านล่าง:</p>
			<p>To reset your password, please use the following verification code:</p>
			<div class="code">` + code + `</div>
			<p>หากคุณไม่ได้ร้องขอรีเซ็ตรหัสผ่าน กรุณาละเว้นอีเมลนี้</p>
			<p>If you did not request a password reset, please ignore this email.</p>
			<div class="footer">
				<p>&copy; 2025 บริษัท ปิ๊บเขียน Code จำกัด / PipWrite Code Co., Ltd.</p>
			</div>
		</div>
	</body>
	</html>
	`
	m.SetBody("text/html", htmlContent)

	d := gomail.NewDialer(smtpHost, port, smtpUser, smtpPass)

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("ส่งอีเมลล้มเหลว: %v", err)
	}

	log.Printf("ส่งรหัสยืนยัน %s ไปยังอีเมล: %s", code, email)
	return nil
}
