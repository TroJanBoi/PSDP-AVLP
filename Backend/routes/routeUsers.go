package routes

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
)

var resetCodes = make(map[string]string)

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
		Email string `json:"email"`
	}

	// ตรวจสอบข้อมูล JSON ที่รับเข้ามา
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	var user models.User
	// ตรวจสอบว่ามีผู้ใช้ที่มีอีเมลนี้หรือไม่
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ใช้ที่มีอีเมลนี้"})
		return
	}

	// สร้างรหัสยืนยันแบบ 6 หลัก
	code := generateVerificationCode()
	// เก็บรหัสไว้ใน map (ในโปรดักชั่นให้ใช้ฐานข้อมูลหรือระบบ cache ที่เหมาะสม)
	resetCodes[input.Email] = code

	// ส่งอีเมล (ที่นี่ใช้ฟังก์ชันจำลอง)
	if err := sendEmail(input.Email, code); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถส่งอีเมลได้"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ส่งอีเมลสำหรับรีเซ็ตรหัสผ่านแล้ว"})
}

func resetPassword(c *gin.Context) {
	var input struct {
		Email       string `json:"email"`
		Code        string `json:"code"`
		NewPassword string `json:"new_password"`
	}

	// ตรวจสอบข้อมูล JSON ที่รับเข้ามา
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ข้อมูลไม่ถูกต้อง"})
		return
	}

	// ตรวจสอบรหัสยืนยัน
	storedCode, exists := resetCodes[input.Email]
	if !exists || storedCode != input.Code {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "รหัสยืนยันไม่ถูกต้อง"})
		return
	}

	var user models.User
	// ค้นหาผู้ใช้จากฐานข้อมูลด้วยอีเมล
	if err := database.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "ไม่พบผู้ใช้ที่มีอีเมลนี้"})
		return
	}

	// อัปเดตรหัสผ่าน (ในโปรดักชั่นควรทำการ hash รหัสผ่าน)
	user.Password = input.NewPassword
	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ไม่สามารถอัปเดตรหัสผ่านได้"})
		return
	}

	// ลบรหัสออกจาก map หลังใช้งานแล้ว
	delete(resetCodes, input.Email)

	c.JSON(http.StatusOK, gin.H{"message": "เปลี่ยนรหัสผ่านสำเร็จ"})
}

func generateVerificationCode() string {
	return fmt.Sprintf("%06d", time.Now().UnixNano()%1000000)
}

func sendEmail(email, code string) error {
	log.Printf("ส่งรหัสยืนยัน %s ไปยังอีเมล: %s", code, email)
	return nil
}
