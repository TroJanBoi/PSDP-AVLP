package test

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// Model ของ User ตาม SQL ที่ให้ไว้
type User struct {
	UserID   uint   `gorm:"column:user_id;primaryKey" json:"user_id"`
	Username string `gorm:"column:username;unique;not null" json:"username"`
	Password string `gorm:"column:password;not null" json:"password"`
	Email    string `gorm:"column:email;unique" json:"email"`
	Name     string `gorm:"column:name" json:"name"`
	Bio      string `gorm:"column:bio" json:"bio"`
	Github   string `gorm:"column:github" json:"github"`
	Youtube  string `gorm:"column:youtube" json:"youtube"`
	Linkedin string `gorm:"column:linkedin" json:"linkedin"`
	Discord  string `gorm:"column:discord" json:"discord"`
}

// ตั้งชื่อ table เป็น "user" ตาม SQL (หมายเหตุ: ชื่อ table "user" เป็น reserved word ในบาง DBMS)
// ถ้าต้องการเปลี่ยนให้ใช้ชื่ออื่น เช่น "users" ก็สามารถเปลี่ยนได้
func (User) TableName() string {
	return "users"
}

const (
	host     = "localhost"
	username = "myuser"
	password = "mypassword"
	dbname   = "mydatabase"
	port     = 5432
)

func main() {
	var err error

	// เชื่อมต่อกับฐานข้อมูล PostgreSQL
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, dbname)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to database: %v\n", err)
	}

	// ใช้ AutoMigrate เพื่อสร้างหรืออัปเดตตารางในฐานข้อมูล
	err = db.AutoMigrate(&User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	// สร้าง Gin router
	r := gin.Default()

	// Route สำหรับ GET /users เพื่อดึงข้อมูลผู้ใช้
	r.GET("/users", func(c *gin.Context) {
		var users []User
		if err := db.Find(&users).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, users)
	})

	// Route สำหรับ POST /users เพื่อสร้างผู้ใช้ใหม่
	r.POST("/users", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Invalid data"})
			return
		}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, user)
	})

	// เริ่มเซิร์ฟเวอร์บนพอร์ต 9898
	r.Run(":9898")
}
