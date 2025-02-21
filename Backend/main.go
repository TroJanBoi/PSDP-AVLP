package main

import (
	"log"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"example.com/greetings/routes"

	"github.com/gin-gonic/gin"
)

func main() {

	database.ConnectDatabase()

	err := database.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	r := gin.Default()

	routes.RegisterUserRoutes(r)

	r.Run(":9898")
}
