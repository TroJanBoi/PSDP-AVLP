package main

import (
	"database/sql"
	"fmt"
	"log"

	// "gorm.io/gorm"
	_ "github.com/lib/pq"
)

// Model ของ User
type User struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// Global db variable
// var db *gorm.DB

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
	// dsn := "host=postgres user=postgres password=postgres dbname=avlp-db0 port=5432"
	fmt.Printf("host=%s user=%s password=%s dbname=%s port=%d \n", host, username, password, dbname, port)
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, dbname)
	// db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("failed to connect to database: %v\n", err)
	}
	// print(db)
	err = db.Ping()
	if err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	fmt.Println("Successfully connected to the database!")

	// อัปเดตหรือสร้างตารางในฐานข้อมูล
	// err = db.AutoMigrate(&User{})
	// if err != nil {
	// 	log.Fatalf("failed to migrate database: %v", err)
	// }

	// สร้าง Gin router
	// r := gin.Default()

	// // Route สำหรับ GET /users
	// r.GET("/users", func(c *gin.Context) {
	// 	var users []User
	// 	// ดึงข้อมูลผู้ใช้จากฐานข้อมูล
	// 	if err := db.Find(&users).Error; err != nil {
	// 		c.JSON(500, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	c.JSON(200, users)
	// })

	// Route สำหรับ POST /users
	// r.POST("/users", func(c *gin.Context) {
	// 	var user User
	// 	if err := c.ShouldBindJSON(&user); err != nil {
	// 		c.JSON(400, gin.H{"error": "Invalid data"})
	// 		return
	// 	}
	// 	// บันทึกข้อมูลผู้ใช้ใหม่ลงในฐานข้อมูล
	// 	if err := db.Create(&user).Error; err != nil {
	// 		c.JSON(500, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	c.JSON(201, user)
	// })

	// เริ่มเซิร์ฟเวอร์
	// r.Run(":9898")
}
