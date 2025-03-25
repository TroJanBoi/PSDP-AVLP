package routes

import (
	"net/http"
	"strconv"
	"time"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
)

// ProblemAttemptRequest represents the request body for creating a problem attempt
type ProblemAttemptRequest struct {
	UserID    uint      `json:"user_id" binding:"required"`
	ProblemID uint      `json:"problem_id" binding:"required"`
	StartedAt time.Time `json:"started_at" binding:"required"`
}

// TestCaseCheckRequest represents the request body for checking test case
type TestCaseCheckRequest struct {
	UserID    uint   `json:"user_id" binding:"required"`
	InputData string `json:"input_data" binding:"required"`
}

// @Summary Create a new problem attempt
// @Description Creates a new attempt for solving a problem
// @Tags problem_attempts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param problem_id path int true "Problem ID"
// @Param attempt body ProblemAttemptRequest true "Attempt data"
// @Success 200 {object} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/problem_attempt/{problem_id} [post]
func createProblemAttempt(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var input ProblemAttemptRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	attempt := models.ProblemAttempt{
		ProblemID: uint(problemID),
		UserID:    input.UserID,
		StartedAt: input.StartedAt,
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถสร้าง attempt ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

// @Summary Get problem attempt details
// @Description Retrieves details of a specific problem attempt
// @Tags problem_attempts
// @Produce json
// @Security BearerAuth
// @Param attempt_id path int true "Attempt ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {object} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/problem_attempt/{attempt_id}/{problem_id} [get]
func getProblemAttempt(c *gin.Context) {
	attemptID, err := strconv.Atoi(c.Param("attempt_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "attempt_id ไม่ถูกต้อง"})
		return
	}

	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	var attempt models.ProblemAttempt
	if err := database.DB.Where("id = ? AND problem_id = ?", attemptID, problemID).
		Preload("User").Preload("Problem").First(&attempt).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบ attempt"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

// @Summary Check test case solution
// @Description Checks if the submitted solution matches test case expectations
// @Tags problem_attempts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case body TestCaseCheckRequest true "Test case check data"
// @Success 200 {object} models.TestCase
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/{class_id}/{problem_id}/test_case [post]
func checkTestCase(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "class_id ไม่ถูกต้อง"})
		return
	}

	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var input TestCaseCheckRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	var testCases []models.TestCase
	if err := database.DB.Where("problem_id = ?", problemID).Find(&testCases).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถดึง test cases ได้: " + err.Error()})
		return
	}

	// For simplicity, returning the first matching test case (you might want to implement more sophisticated logic)
	for _, tc := range testCases {
		if tc.InputData == input.InputData {
			c.JSON(http.StatusOK, tc)
			return
		}
	}

	c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบ test case ที่ตรงกับ input"})
}

// @Summary Get problem scores
// @Description Retrieves all attempts and scores for a specific problem
// @Tags problem_attempts
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {array} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse
// @Failure 401 {object} models.ErrorResponse
// @Failure 404 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /api/{class_id}/{problem_id} [get]
func getProblemScores(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "class_id ไม่ถูกต้อง"})
		return
	}

	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var attempts []models.ProblemAttempt
	if err := database.DB.Where("problem_id = ?", problemID).
		Preload("User").Preload("Problem").Find(&attempts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถดึงข้อมูล attempts ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, attempts)
}

func RegisterProblemAttemptRoutes(r *gin.Engine) {
	// attemptGroup := r.Group("/api", middleware.AuthMiddleware())
	attemptGroup := r.Group("/api")
	{
		attemptGroup.POST("/problem_attempt/:problem_id", createProblemAttempt)
		attemptGroup.GET("/problem_attempt/:attempt_id/:problem_id", getProblemAttempt)
		attemptGroup.POST("/:class_id/:problem_id/test_case", checkTestCase)
		attemptGroup.GET("/:class_id/:problem_id", getProblemScores)
	}
}
