package main

import (
	"log"

	"example.com/greetings/database"
	"example.com/greetings/models"

	"github.com/gin-gonic/gin"
)

func main() {

	database.ConnectDatabase()

	err := database.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	r := gin.Default()

	r.GET("/users", func(c *gin.Context) {
		var users []models.User
		if err := database.DB.Find(&users).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, users)
	})

	r.POST("/users", func(c *gin.Context) {
		var user models.User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": "Invalid data"})
			return
		}
		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(201, user)
	})

	r.Run(":9898")
}
