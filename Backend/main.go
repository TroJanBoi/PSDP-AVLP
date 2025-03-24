// go get -u github.com/swaggo/swag/cmd/swag
// go get -u github.com/swaggo/gin-swagger
// go get -u github.com/swaggo/files

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"example.com/greetings/routes"
	"example.com/greetings/seed"

	_ "example.com/greetings/docs" // Import generated Swagger docs
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// @title Assembly Visual Learning Platform API
// @version 1.0
// @description API for managing users, classes, and assembly-related functionality in the Assembly Visual Learning Platform
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:9898
// @BasePath /

// @SecurityDefinitions.apiKey BearerAuth
// @in header
// @name Authorization
// @description "Enter the token with the `Bearer ` prefix, e.g., `Bearer <token>`"

type Response struct {
	Message string `json:"message"`
}

// @Summary Check if API is ready
// @Description Returns a message indicating the API is ready to accept requests
// @Produce json
// @Success 200 {object} Response
// @Router /api-ready [get]
func apiReadyHandler(c *gin.Context) {
	c.JSON(http.StatusOK, Response{Message: "✅ API is ready to accept requests!"})
}

func htmlHandler(c *gin.Context) {
	c.File("public/index.html")
}

func swaggerHandler(c *gin.Context) {
	c.File("public/swagger.html")
}

func main() {
	// // รันคำสั่ง swag init ก่อนเริ่มโปรแกรม
	// log.Println("Generating Swagger docs for Users...")
	// cmd := exec.Command("swag", "init", "--tags", "Users", "-o", "docs/users")
	// cmd.Stdout = os.Stdout // แสดง output ใน terminal
	// cmd.Stderr = os.Stderr // แสดง error ใน terminal
	// if err := cmd.Run(); err != nil {
	// 	log.Fatalf("failed to run swag init: %v", err)
	// }
	// log.Println("Swagger docs for Users generated successfully")

	// // รันคำสั่ง swag init สำหรับ Classes
	// log.Println("Generating Swagger docs for Classes...")
	// cmd = exec.Command("swag", "init", "--tags", "Classes", "-o", "docs/classes")
	// cmd.Stdout = os.Stdout
	// cmd.Stderr = os.Stderr
	// if err := cmd.Run(); err != nil {
	// 	log.Fatalf("failed to run swag init for Classes: %v", err)
	// }
	// log.Println("Swagger docs for Classes generated successfully")

	// // รันคำสั่ง swag init สำหรับ Problems
	// log.Println("Generating Swagger docs for Problems...")
	// cmd = exec.Command("swag", "init", "--tags", "Problems", "-o", "docs/problems")
	// cmd.Stdout = os.Stdout
	// cmd.Stderr = os.Stderr
	// if err := cmd.Run(); err != nil {
	// 	log.Fatalf("failed to run swag init for Problems: %v", err)
	// }
	// log.Println("Swagger docs for Problems generated successfully")

	// // รันคำสั่ง swag init สำหรับ Test_case
	// log.Println("Generating Swagger docs for Test_case...")
	// cmd = exec.Command("swag", "init", "--tags", "Test_cases", "-o", "docs/test_cases")
	// cmd.Stdout = os.Stdout
	// cmd.Stderr = os.Stderr
	// if err := cmd.Run(); err != nil {
	// 	log.Fatalf("failed to run swag init for Test_case: %v", err)
	// }
	// log.Println("Swagger docs for Test_case generated successfully")

	// // รันคำสั่ง swag init สำหรับ main
	// log.Println("Generating Swagger docs for Test_case...")
	// cmd = exec.Command("swag", "init", "-o", "docs")
	// cmd.Stdout = os.Stdout
	// cmd.Stderr = os.Stderr
	// if err := cmd.Run(); err != nil {
	// 	log.Fatalf("failed to run swag init for Test_case: %v", err)
	// }
	// log.Println("Swagger docs for Test_case generated successfully")

	if err := os.MkdirAll("uploads/classes", os.ModePerm); err != nil {
		log.Fatalf("failed to create uploads directory: %v", err)
	}

	log.Println("Connecting to the database...")
	database.ConnectDatabase()
	log.Println("Database connection established")

	log.Println("Running database migrations...")

	// Migrate both User and Class models
	err := database.DB.AutoMigrate(&models.User{}, &models.Class{}, &models.Problem{}, &models.TestCase{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)

	}
	log.Println("Database migration completed")

	// Seed the database with default data
	log.Println("Seeding the database...")
	seed.SeedData()
	log.Println("Database seeding completed")

	// Set Gin to release mode in production
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001", "http://localhost:9898"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.RegisterUserRoutes(r)
	routes.RegisterAsmRoutes(r)
	routes.RegisterClassRoutes(r)
	routes.RegisterProblemRoutes(r)

	r.GET("/api-ready", apiReadyHandler)
	r.GET("/", htmlHandler)

	// Serve Swagger JSON files

	r.StaticFile("/swagger-docs/all.json", "docs/swagger.json")
	r.StaticFile("/swagger-docs/users.json", "docs/users/swagger.json")
	r.StaticFile("/swagger-docs/classes.json", "docs/classes/swagger.json")
	r.StaticFile("/swagger-docs/problems.json", "docs/problems/swagger.json")
	r.StaticFile("/swagger-docs/test_case.json", "docs/test_case/swagger.json")
	r.StaticFile("/swagger-docs/asm.json", "docs/asm/swagger.json")

	// Serve custom Swagger UI
	r.GET("/swagger/*any", swaggerHandler)

	// Serve uploaded images
	r.Static("/uploads", "./uploads")

	r.Run(":9898")
}
