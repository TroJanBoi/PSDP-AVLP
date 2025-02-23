package main

import (
	"log"
	"net/http"
	"time"

	"fmt"
	"strings"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"example.com/greetings/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Response struct {
	Message string `json:"message"`
}

func apiReadyHandler(c *gin.Context) {
	c.JSON(http.StatusOK, Response{Message: "✅ API is ready to accept requests!"})
}

func htmlHandler(c *gin.Context) {
	c.File("public/index.html")
}

type RequestData struct {
	Instructions []string `json:"instructions"`
}

// Handler สำหรับประมวลผล Assembly Code
func executeAssemblyHandler(c *gin.Context) {
	var req RequestData
	fmt.Println(req)
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Received Instructions:", req.Instructions)

	// จำลอง registers เพื่อเก็บค่าการคำนวณ
	registers := make(map[string]int)
	for _, instr := range req.Instructions {
		parts := strings.Fields(instr)
		if len(parts) < 3 {
			continue
		}
		fmt.Println("Processing Instruction:", instr)

		switch parts[0] {
		case "MOV":
			// ตัวอย่าง: "MOV A, 5" จะทำการกำหนดค่าให้ A = 5
			var value int
			fmt.Sscanf(parts[2], "%d", &value)
			registers[parts[1]] = value
			fmt.Println("MOV:", parts[1], "=", value)
		case "ADD":
			// ตัวอย่าง: "ADD A, 10" จะทำการบวกค่า 10 ให้กับ A
			currentValue := registers[parts[1]]
			fmt.Println("Current Value in", parts[1], "before ADD:", currentValue)

			num := 0
			fmt.Sscanf(parts[2], "%d", &num)
			registers[parts[1]] = currentValue + num
			fmt.Println("ADD:", parts[1], "new value =", registers[parts[1]])
		case "SUB":
			// ตัวอย่าง: "ADD A, 10" จะทำการบวกค่า 10 ให้กับ A
			currentValue := registers[parts[1]]
			fmt.Println("Current Value in", parts[1], "before ADD:", currentValue)

			num := 0
			fmt.Sscanf(parts[2], "%d", &num)
			registers[parts[1]] = currentValue - num
			fmt.Println("ADD:", parts[1], "new value =", registers[parts[1]])
		}
	}
	fmt.Println("Registers:", registers)

	// ส่งผลลัพธ์กลับเป็น JSON โดยสมมุติว่า register A คือผลลัพธ์ที่ต้องการ
	result := registers["A,"]
	fmt.Println("Final Result (A):", result)
	c.JSON(http.StatusOK, gin.H{"result": result})
	// c.JSON(http.StatusOK, gin.H{"result": registers["A"]})
}

func main() {

	database.ConnectDatabase()

	err := database.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.RegisterUserRoutes(r)

	r.GET("/api-ready", apiReadyHandler)
	r.GET("/", htmlHandler)
	r.POST("/execute", executeAssemblyHandler)

	r.Run(":9898")
}
