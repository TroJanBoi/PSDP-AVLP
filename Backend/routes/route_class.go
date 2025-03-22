package routes

import (
	"net/http"
	"strconv"

	"example.com/greetings/database"
	"example.com/greetings/models"

	"github.com/gin-gonic/gin"
)

// swag init --tags Classes -o docs/classes

// CreateClassRequest represents the request body for creating a class
type CreateClassRequest struct {
	Topic       string `json:"topic" binding:"required"`
	Description string `json:"description"`
	MaxPlayer   int    `json:"max_player" binding:"required,gt=0"`
	IsPublic    bool   `json:"isPublic"`
	Img         string `json:"img"`
	OwnerID     uint   `json:"owner_id" binding:"required"`
}

// UpdateClassRequest represents the request body for updating a class
type UpdateClassRequest struct {
	Topic       string `json:"topic,omitempty"`
	Description string `json:"description,omitempty"`
	MaxPlayer   int    `json:"max_player,omitempty"`
	IsPublic    *bool  `json:"isPublic,omitempty"`
	Img         string `json:"img,omitempty"`
	OwnerID     uint   `json:"owner_id,omitempty"`
}

func RegisterClassRoutes(r *gin.Engine) {
	classGroup := r.Group("/classes")
	{
		classGroup.GET("", getClasses)
		classGroup.GET("/:id", getClassByID)
		classGroup.POST("", createClass)
		classGroup.PUT("/:id", updateClass)
		classGroup.DELETE("/:id", deleteClass)
	}
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

// @Summary Get class by ID
// @Tags Classes
// @Description Retrieve a class by its ID
// @Produce json
// @Param id path string true "Class ID"
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
// @Description Create a new class with the provided details
// @Accept json
// @Produce json
// @Param class body routes.CreateClassRequest true "Class data"
// @Success 201 {object} models.Class
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /classes [post]
func createClass(c *gin.Context) {
	var input CreateClassRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	// Check if the owner exists
	var owner models.User
	if err := database.DB.First(&owner, input.OwnerID).Error; err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Owner not found"})
		return
	}

	class := models.Class{
		Topic:       input.Topic,
		Description: input.Description,
		MaxPlayer:   input.MaxPlayer,
		IsPublic:    input.IsPublic,
		Img:         input.Img,
		OwnerID:     input.OwnerID,
	}
	if err := database.DB.Create(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	// Preload the Owner for the response
	database.DB.Preload("Owner").First(&class, class.ID)
	c.JSON(http.StatusCreated, class)
}

// @Summary Update a class
// @Tags Classes
// @Description Update class details by ID
// @Accept json
// @Produce json
// @Param id path string true "Class ID"
// @Param class body routes.UpdateClassRequest true "Updated class data"
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

	var input UpdateClassRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid JSON data: " + err.Error()})
		return
	}

	// Validate owner if provided
	if input.OwnerID != 0 {
		var owner models.User
		if err := database.DB.First(&owner, input.OwnerID).Error; err != nil {
			c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Owner not found"})
			return
		}
	}

	// Update fields only if they are provided
	updateData := map[string]interface{}{}
	if input.Topic != "" {
		updateData["topic"] = input.Topic
	}
	if input.Description != "" {
		updateData["description"] = input.Description
	}
	if input.MaxPlayer != 0 {
		updateData["max_player"] = input.MaxPlayer
	}
	if input.IsPublic != nil {
		updateData["is_public"] = *input.IsPublic
	}
	if input.Img != "" {
		updateData["img"] = input.Img
	}
	if input.OwnerID != 0 {
		updateData["owner_id"] = input.OwnerID
	}

	if len(updateData) > 0 {
		if err := database.DB.Model(&class).Updates(updateData).Error; err != nil {
			c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
			return
		}
	}

	// Preload the Owner for the response
	database.DB.Preload("Owner").First(&class, class.ID)
	c.JSON(http.StatusOK, class)
}

// @Summary Delete a class
// @Tags Classes
// @Description Delete a class by ID
// @Produce json
// @Param id path string true "Class ID"
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

	if err := database.DB.Delete(&class).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{Message: "Successfully deleted class"})
}
