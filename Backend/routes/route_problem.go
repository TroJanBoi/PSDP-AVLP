package routes

import (
	"net/http"
	"strconv"

	// "time"

	"example.com/greetings/database"
	"example.com/greetings/middleware"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
)

// NewProblemRequest represents the request body for creating/updating a problem
type NewProblemRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description"`
}

// NewTestCaseRequest represents the request body for creating/updating a test case
type NewTestCaseRequest struct {
	InputData      string `json:"input_data"`
	ExpectedOutput string `json:"expected_output" binding:"required"`
	Description    string `json:"description"`
	IsPublic       bool   `json:"isPublic"`
}

// Add new request/response structs
type ProblemAttemptRequest struct {
	UserID    int `json:"user_id" binding:"required"`
	ProblemID int `json:"problem_id" binding:"required"`
	// StartedAt int64 `json:"started_at" binding:"required"`
}

type TestCaseCheckRequest struct {
	UserID    int    `json:"user_id" binding:"required"`
	InputData string `json:"input_data" binding:"required"`
}

func RegisterProblemRoutes(r *gin.Engine) {
	apiGroup := r.Group("/api", middleware.AuthMiddleware())
	{
		// Problem routes with /classes prefix
		apiGroup.POST("/classes/:class_id/problems", createProblemInClass)
		apiGroup.GET("/classes/:class_id/problems", getProblemsInClass)
		apiGroup.DELETE("/classes/:class_id/problems/:problem_id", deleteProblem)
		apiGroup.PUT("/classes/:class_id/problems/:problem_id", updateProblem)

		// Test case routes with /problems prefix
		apiGroup.POST("/problems/:problem_id/testcases", createTestCaseForProblem)
		apiGroup.DELETE("/classes/:class_id/problems/:problem_id/testcases/:test_case_id", deleteTestCase)
		apiGroup.PUT("/classes/:class_id/problems/:problem_id/testcases/:test_case_id", updateTestCase)

		apiGroup.POST("/problem_attempt/:problem_id", createProblemAttempt)
		apiGroup.GET("/problem_attempt/:attempt_id/:problem_id", getProblemAttempt)
		apiGroup.POST("/classes/:class_id/:problem_id/test_case", checkTestCase)
		apiGroup.GET("/classes/:class_id/:problem_id", getAttemptScore)

	}
}

// @Summary Create a new problem attempt
// @Tags ProblemAttempts
// @Description Create a new attempt for solving a problem
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param problem_id path int true "Problem ID"
// @Param body body ProblemAttemptRequest true "Attempt details"
// @Success 201 {object} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Problem not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/problem_attempt/{problem_id} [post]
func createProblemAttempt(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Problem not found"})
		return
	}

	var input ProblemAttemptRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	attempt := models.ProblemAttempt{
		UserID:    uint(input.UserID),
		ProblemID: uint(problemID),
		// StartedAt: time.Unix(input.StartedAt, 0),
	}

	if err := database.DB.Create(&attempt).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, attempt)
}

// @Summary Get problem attempt details
// @Tags ProblemAttempts
// @Description Retrieve details of a specific problem attempt
// @Produce json
// @Security BearerAuth
// @Param attempt_id path int true "Attempt ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {object} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse "Invalid ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Attempt not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/problem_attempt/{attempt_id}/{problem_id} [get]
func getProblemAttempt(c *gin.Context) {
	attemptID, err := strconv.Atoi(c.Param("attempt_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid attempt ID"})
		return
	}

	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var attempt models.ProblemAttempt
	if err := database.DB.
		Where("id = ? AND problem_id = ?", attemptID, problemID).
		First(&attempt).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Attempt not found"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

// @Summary Check test case result
// @Tags ProblemAttempts
// @Description Check if the submitted solution matches test case
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param body body TestCaseCheckRequest true "Test case check details"
// @Success 200 {object} models.TestCase
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Problem or test case not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/{problem_id}/test_case [post]
func checkTestCase(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Problem not found"})
		return
	}

	var input TestCaseCheckRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	var testCase models.TestCase
	if err := database.DB.
		Where("problem_id = ? AND input_data = ?", problemID, input.InputData).
		First(&testCase).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Matching test case not found"})
		return
	}

	c.JSON(http.StatusOK, testCase)
}

// @Summary Get attempt score
// @Tags ProblemAttempts
// @Description Retrieve score for a problem attempt
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {object} models.ProblemAttempt
// @Failure 400 {object} models.ErrorResponse "Invalid ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Attempt not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/{problem_id} [get]
func getAttemptScore(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	userID, _ := c.Get("user_id")

	var attempt models.ProblemAttempt
	if err := database.DB.
		Where("problem_id = ? AND user_id = ?", problemID, userID).
		Order("started_at DESC").
		First(&attempt).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Attempt not found"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}

// @Summary Create a new problem in a class
// @Tags Problems
// @Description Create a new problem in a specific class
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param body body NewProblemRequest true "Problem details"
// @Success 201 {object} models.Problem
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Class not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems [post]
func createProblemInClass(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid class ID"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Class not found"})
		return
	}

	var input NewProblemRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	problem := models.Problem{
		ClassID:     uint(classID),
		UserID:      userID.(uint),
		Title:       input.Title,
		Description: input.Description,
	}

	if err := database.DB.Create(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}

	c.JSON(http.StatusCreated, problem)
}

// @Summary Get problems in a class
// @Tags Problems
// @Description Retrieve all problems in a specific class
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Success 200 {array} models.Problem
// @Failure 400 {object} models.ErrorResponse "Invalid class ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems [get]
func getProblemsInClass(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid class ID"})
		return
	}

	var problems []models.Problem
	if err := database.DB.
		Where("class_id = ?", classID).
		Preload("Class").       // โหลดข้อมูล Class
		Preload("Class.Owner"). // โหลดข้อมูล Owner ของ Class
		Preload("User").        // โหลดข้อมูล User
		Preload("TestCases").   // โหลด Test Cases (ถ้ามี)
		Find(&problems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, problems)
}

// @Summary Create a test case for a problem
// @Tags TestCases
// @Description Create a new test case for a specific problem
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param problem_id path int true "Problem ID"
// @Param body body NewTestCaseRequest true "Test case details"
// @Success 201 {object} models.TestCase
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 404 {object} models.ErrorResponse "Problem not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/problems/{problem_id}/testcases [post]
func createTestCaseForProblem(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Problem not found"})
		return
	}

	userID, _ := c.Get("user_id")
	if problem.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Not authorized"})
		return
	}

	var input NewTestCaseRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	testCase := models.TestCase{
		ProblemID:      uint(problemID),
		InputData:      input.InputData,
		ExpectedOutput: input.ExpectedOutput,
		Description:    input.Description,
		IsPublic:       input.IsPublic,
	}

	if err := database.DB.Create(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusCreated, testCase)
}

// @Summary Delete a test case
// @Tags TestCases
// @Description Delete a test case for a specific problem
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case_id path int true "Test Case ID"
// @Success 200 {object} map[string]string "message: Success Remove test case"
// @Failure 400 {object} models.ErrorResponse "Invalid ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Forbidden"
// @Failure 404 {object} models.ErrorResponse "Not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems/{problem_id}/testcases/{test_case_id} [delete]
func deleteTestCase(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}
	testCaseID, err := strconv.Atoi(c.Param("test_case_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid test case ID"})
		return
	}

	var testCase models.TestCase
	if err := database.DB.Preload("Problem").First(&testCase, testCaseID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Test case not found"})
		return
	}

	if int(testCase.ProblemID) != problemID {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Test case does not belong to this problem"})
		return
	}

	userID, _ := c.Get("user_id")
	if testCase.Problem.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Not authorized"})
		return
	}

	if err := database.DB.Delete(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, map[string]string{"message": "Success Remove test case"})
}

// @Summary Delete a problem
// @Tags Problems
// @Description Delete a problem from a class
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {object} map[string]string "message: Success Remove Problem"
// @Failure 400 {object} models.ErrorResponse "Invalid ID"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Forbidden"
// @Failure 404 {object} models.ErrorResponse "Problem not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems/{problem_id} [delete]
func deleteProblem(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Problem not found"})
		return
	}

	userID, _ := c.Get("user_id")
	if problem.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Not authorized"})
		return
	}

	if err := database.DB.Delete(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, map[string]string{"message": "Success Remove Problem"})
}

// @Summary Update a problem
// @Tags Problems
// @Description Update a problem in a class
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param body body NewProblemRequest true "Problem details"
// @Success 200 {object} map[string]string "message: edit problem success"
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Forbidden"
// @Failure 404 {object} models.ErrorResponse "Problem not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems/{problem_id} [put]
func updateProblem(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Problem not found"})
		return
	}

	userID, _ := c.Get("user_id")
	if problem.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Not authorized"})
		return
	}

	var input NewProblemRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	problem.Title = input.Title
	problem.Description = input.Description

	if err := database.DB.Save(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, map[string]string{"message": "edit problem success"})
}

// @Summary Update a test case
// @Tags TestCases
// @Description Update a test case for a problem
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case_id path int true "Test Case ID"
// @Param body body NewTestCaseRequest true "Test case details"
// @Success 200 {object} map[string]string "message: edit test case success"
// @Failure 400 {object} models.ErrorResponse "Invalid data"
// @Failure 401 {object} models.ErrorResponse "Unauthorized"
// @Failure 403 {object} models.ErrorResponse "Forbidden"
// @Failure 404 {object} models.ErrorResponse "Test case not found"
// @Failure 500 {object} models.ErrorResponse
// @Router /api/classes/{class_id}/problems/{problem_id}/testcases/{test_case_id} [put]
func updateTestCase(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid problem ID"})
		return
	}
	testCaseID, err := strconv.Atoi(c.Param("test_case_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid test case ID"})
		return
	}

	var testCase models.TestCase
	if err := database.DB.Preload("Problem").First(&testCase, testCaseID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Test case not found"})
		return
	}

	if int(testCase.ProblemID) != problemID {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Test case does not belong to this problem"})
		return
	}

	userID, _ := c.Get("user_id")
	if testCase.Problem.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, models.ErrorResponse{Error: "Not authorized"})
		return
	}

	var input NewTestCaseRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "Invalid data: " + err.Error()})
		return
	}

	testCase.InputData = input.InputData
	testCase.ExpectedOutput = input.ExpectedOutput
	testCase.Description = input.Description
	testCase.IsPublic = input.IsPublic

	if err := database.DB.Save(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: err.Error()})
		return
	}
	c.JSON(http.StatusOK, map[string]string{"message": "edit test case success"})
}
