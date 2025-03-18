// go get -u github.com/swaggo/swag/cmd/swag
// go get -u github.com/swaggo/gin-swagger
// go get -u github.com/swaggo/files

package main

import (
	"log"
	"net/http"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"example.com/greetings/routes"

	_ "example.com/greetings/docs" // Import generated Swagger docs
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

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

func main() {

	database.ConnectDatabase()

	err := database.DB.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

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

	r.GET("/api-ready", apiReadyHandler)
	r.GET("/", htmlHandler)

	// Add Swagger endpoint
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	r.Run(":9898")
}
