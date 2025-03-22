package routes

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
)

// CreateClassRequest represents the request body for creating a class
type CreateClassRequest struct {
	Topic       string `form:"topic" binding:"required"`
	Description string `form:"description"`
	MaxPlayer   int    `form:"max_player" binding:"required"`
	IsPublic    bool   `form:"is_public"`
}

// UpdateClassRequest represents the request body for updating a class
type UpdateClassRequest struct {
	Topic       string `form:"topic"`
	Description string `form:"description"`
	MaxPlayer   int    `form:"max_player"`
	IsPublic    bool   `form:"is_public"`
}

func RegisterClassRoutes(r *gin.Engine) {
	// Apply AuthMiddleware to all /classes routes
	classGroup := r.Group("/classes")
	{
		classGroup.GET("", getClasses)
		classGroup.GET("/:id", getClassByID)
		classGroup.POST("", createClass)
		classGroup.PUT("/:id", updateClass)
		classGroup.DELETE("/:id", deleteClass)
	}
}

// saveUploadedFile handles the file upload and returns the file path
func saveUploadedFile(c *gin.Context, fieldName string) (string, error) {
	file, err := c.FormFile(fieldName)
	if err != nil {
		return "", err
	}

	// Validate file type (only allow images)
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" {
		return "", fmt.Errorf("invalid file type: only .jpg, .jpeg, .png, and .gif are allowed")
	}

	// Generate a unique filename using timestamp
	filename := fmt.Sprintf("class-image-%d%s", time.Now().UnixNano(), ext)
	filePath := filepath.Join("uploads", "classes", filename)

	// Save the file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		return "", fmt.Errorf("failed to save file: %v", err)
	}

	// Return the relative path to be stored in the database
	return fmt.Sprintf("/uploads/classes/%s", filename), nil
}

// @Summary Get all classes
// @Tags Classes
// @Description Retrieve a list of all classes
// @Produce json
// @Success 200 {array} models.Class
// @Failure 500 {object} models.ErrorResponse
// @Router /classes [get]
func getClasses(c *gin.Context) {
	var classes []models.Class
	if err := database.DB.Preload("Owner").Find(&classes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, classes)
}

// @Summary Get a class by ID
// @Tags Classes
// @Description Retrieve a class by its ID
// @Produce json
// @Param id path int true "Class ID"
// @Success 200 {object} models.Class
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes/{id} [get]
func getClassByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid class ID"})
		return
	}

	var class models.Class
	if err := database.DB.Preload("Owner").First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}
	c.JSON(http.StatusOK, class)
}

// @Summary Create a new class
// @Tags Classes
// @Description Create a new class with the provided details and an optional image
// @Accept multipart/form-data
// @Produce json
// @Param topic formData string true "Class topic"
// @Param description formData string false "Class description"
// @Param max_player formData int true "Maximum number of players"
// @Param is_public formData boolean false "Whether the class is public"
// @Param img formData file false "Class image"
// @Success 201 {object} models.Class
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes [post]
func createClass(c *gin.Context) {
	var input CreateClassRequest
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	// Get the user ID from the JWT token
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User ID not found in token"})
		return
	}

	// Check if the owner exists
	var owner models.User
	if err := database.DB.First(&owner, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Owner not found"})
		return
	}

	// Handle file upload
	var imgPath string
	if file, _ := c.FormFile("img"); file != nil {
		path, err := saveUploadedFile(c, "img")
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
			return
		}
		imgPath = path
	}

	class := models.Class{
		Topic:       input.Topic,
		Description: input.Description,
		MaxPlayer:   input.MaxPlayer,
		IsPublic:    input.IsPublic,
		Img:         imgPath,
		OwnerID:     userID.(uint),
	}
	if err := database.DB.Create(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	// Preload the owner for the response
	database.DB.Preload("Owner").First(&class, class.ID)
	c.JSON(http.StatusCreated, class)
}

// @Summary Update a class
// @Tags Classes
// @Description Update a class with the provided details and an optional image
// @Accept multipart/form-data
// @Produce json
// @Param id path int true "Class ID"
// @Param topic formData string false "Class topic"
// @Param description formData string false "Class description"
// @Param max_player formData int false "Maximum number of players"
// @Param is_public formData boolean false "Whether the class is public"
// @Param img formData file false "Class image"
// @Success 200 {object} models.Class
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes/{id} [put]
func updateClass(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid class ID"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	// Check if the authenticated user is the owner of the class
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User ID not found in token"})
		return
	}
	if class.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "You are not authorized to update this class"})
		return
	}

	var input UpdateClassRequest
	if err := c.ShouldBind(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	// Handle file upload
	if file, _ := c.FormFile("img"); file != nil {
		path, err := saveUploadedFile(c, "img")
		if err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
			return
		}
		class.Img = path
	}

	// Update fields if provided
	if input.Topic != "" {
		class.Topic = input.Topic
	}
	if input.Description != "" {
		class.Description = input.Description
	}
	if input.MaxPlayer != 0 {
		class.MaxPlayer = input.MaxPlayer
	}
	// Always update IsPublic, even if false (since false is a valid value)
	class.IsPublic = input.IsPublic

	if err := database.DB.Save(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	// Preload the owner for the response
	database.DB.Preload("Owner").First(&class, class.ID)
	c.JSON(http.StatusOK, class)
}

// @Summary Delete a class
// @Tags Classes
// @Description Delete a class by its ID
// @Produce json
// @Param id path int true "Class ID"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes/{id} [delete]
func deleteClass(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid class ID"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, id).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	// Check if the authenticated user is the owner of the class
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "User ID not found in token"})
		return
	}
	if class.OwnerID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "You are not authorized to delete this class"})
		return
	}

	if err := database.DB.Delete(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Class deleted successfully"})
}
