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

// swag init --tags Users -o docs/users

var resetCodes = make(map[string]struct {
	Code      string
	ExpiresAt time.Time
})

// ForgotPasswordRequest represents the request body for forgot-password
type ForgotPasswordRequest struct {
	Username string `json:"username" binding:"required"`
}

// CreateUserRequest represents the request body for creating a user
type CreateUserRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

// LoginRequest represents the request body for login
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// ResetPasswordRequest represents the request body for resetting a password
type ResetPasswordRequest struct {
	Email       string `json:"email" binding:"required,email"`
	Code        string `json:"code" binding:"required"`
	NewPassword string `json:"new_password" binding:"required"`
}

// UpdateUserRequest represents the request body for updating a user
type UpdateUserRequest struct {
	Name     string `json:"name,omitempty"`
	Password string `json:"password,omitempty"`
	Bio      string `json:"bio,omitempty"`
	Github   string `json:"github,omitempty"`
	Youtube  string `json:"youtube,omitempty"`
	Linkedin string `json:"linkedin,omitempty"`
	Discord  string `json:"discord,omitempty"`
}

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

// @Summary Get all users
// @Tags Users
// @Description Retrieve a list of all users
// @Produce json
// @Success 200 {array} models.User
// @Failure 500 {object} models.ErrorResponse
// @Router /users [get]
func getUsers(c *gin.Context) {
	var users []models.User
	if err := database.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, users)
}

// @Summary Create a new user
// @Tags Users
// @Description Create a new user with the provided details
// @Accept json
// @Produce json
// @Param user body routes.CreateUserRequest true "User data"
// @Success 201 {object} models.User
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users [post]
func createUser(c *gin.Context) {
	var input CreateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}
	user := models.User{
		Username: input.Username,
		Password: input.Password,
		Email:    input.Email,
	}
	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, user)
}

// @Summary Get user by ID
// @Tags Users
// @Description Retrieve a user by their ID
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.User
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{id} [get]
func getUserByID(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary Update a user
// @Tags Users
// @Description Update user details by ID
// @Accept json
// @Produce json
// @Param id path string true "User ID"
// @Param user body routes.UpdateUserRequest true "Updated user data"
// @Success 200 {object} models.User
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{id} [put]
func updateUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User
	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "User not found"})
		return
	}
	var input UpdateUserRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid JSON data: " + err.Error()})
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
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary Delete a user
// @Tags Users
// @Description Delete a user by ID
// @Produce json
// @Param id path string true "User ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{id} [delete]
func deleteUser(c *gin.Context) {
	id := c.Param("id")
	var user models.User

	if err := database.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "User not found"})
		return
	}

	if err := database.DB.Delete(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Successfully deleted user"})
}

// @Summary Login user
// @Tags Users
// @Description Authenticate a user with username and password
// @Accept json
// @Produce json
// @Param credentials body routes.LoginRequest true "Login credentials"
// @Success 200 {object} models.LoginResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Router /users/login [post]
func loginUser(c *gin.Context) {
	var input LoginRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid json data: " + err.Error()})
		return
	}
	var user models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "The username or password is incorrect."})
		return
	}
	if user.Password != input.Password {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "The username or password is incorrect."})
		return
	}
	c.JSON(http.StatusOK, models.LoginResponse{
		Message: "Login successful",
		User:    user,
	})
}

// @Summary Forgot password
// @Tags Users
// @Description Send a password reset code to the user's email
// @Accept json
// @Produce json
// @Param request body routes.ForgotPasswordRequest true "Username for password reset"
// @Success 200 {object} models.ForgotPasswordResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/forgot-password [post]
func forgotPassword(c *gin.Context) {
	var input ForgotPasswordRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "The information is incorrect."})
		return
	}
	var user models.User
	if err := database.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "No users found with this username."})
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
	if err := sendEmail(user.Email, user.Username, code); err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Unable to send email"})
		return
	}
	c.JSON(http.StatusOK, models.ForgotPasswordResponse{
		Message:  "Password reset email sent.",
		Username: user.Username,
		Email:    user.Email,
		Time:     expirationTime,
	})
}

// @Summary Reset password
// @Tags Users
// @Description Reset user's password using a verification code
// @Accept json
// @Produce json
// @Param reset body routes.ResetPasswordRequest true "Reset data"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/reset-password [post]
func resetPassword(c *gin.Context) {
	var input ResetPasswordRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}
	storedData, exists := resetCodes[input.Email]
	if !exists || storedData.Code != input.Code {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Verification code is invalid."})
		return
	}
	if time.Now().After(storedData.ExpiresAt) {
		delete(resetCodes, input.Email)
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "Verification code has expired."})
		return
	}
	var user models.User
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "No users found with this email address."})
		return
	}
	user.Password = input.NewPassword
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "Unable to update password: " + err.Error()})
		return
	}
	delete(resetCodes, input.Email)
	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Password changed successfully"})
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
