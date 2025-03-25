package routes

import (
	"net/http"
	"strconv"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"github.com/gin-gonic/gin"
)

// CreateProblemRequest represents the request body for creating a problem
type CreateProblemRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

// CreateTestCaseRequest represents the request body for creating a test case
type CreateTestCaseRequest struct {
	InputData      string `json:"input_data" binding:"required"`
	ExpectedOutput string `json:"expected_output" binding:"required"`
	Description    string `json:"description" binding:"required"`
	IsPublic       bool   `json:"isPublic"`
}

// UpdateProblemRequest represents the request body for updating a problem
type UpdateProblemRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
}

// UpdateTestCaseRequest represents the request body for updating a test case
type UpdateTestCaseRequest struct {
	InputData      string `json:"input_data" binding:"required"`
	ExpectedOutput string `json:"expected_output" binding:"required"`
	Description    string `json:"description" binding:"required"`
	IsPublic       bool   `json:"isPublic"`
}

// @Summary สร้างโจทย์ใหม่ในคลาส
// @Description สร้างโจทย์ใหม่ในคลาสที่ระบุ โดยต้องระบุ class_id ใน URL และส่งข้อมูลโจทย์ใน request body
// @Tags problems
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param problem body CreateProblemRequest true "ข้อมูลโจทย์"
// @Success 200 {object} models.Problem "โจทย์ที่สร้างสำเร็จ"
// @Failure 400 {object} models.ErrorResponse "ข้อมูลที่ส่งมาไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาส"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/problems/{problem_id} [post]
func createProblem(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "class_id ไม่ถูกต้อง"})
		return
	}

	// ไม่ใช้ problemID จาก path เพื่อกำหนด ID เพราะ GORM จะจัดการให้
	_, err = strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{Error: "ไม่พบข้อมูลผู้ใช้"})
		return
	}

	var input CreateProblemRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	problem := models.Problem{
		// ลบการกำหนด ID ออก
		ClassID:     uint(classID),
		UserID:      userID.(uint),
		Title:       input.Title,
		Description: input.Description,
	}

	if err := database.DB.Create(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถสร้างโจทย์ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, problem)
}

// @Summary ดูโจทย์ทั้งหมดในคลาส
// @Description ดึงรายการโจทย์ทั้งหมดในคลาสที่ระบุ โดยต้องระบุ class_id ใน URL
// @Tags problems
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Success 200 {array} models.Problem "รายการโจทย์"
// @Failure 400 {object} models.ErrorResponse "class_id ไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาส"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/classes/{class_id}/problem [get]
func getProblems(c *gin.Context) {
	classID, err := strconv.Atoi(c.Param("class_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "class_id ไม่ถูกต้อง"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	var problems []models.Problem
	if err := database.DB.Preload("User").Where("class_id = ?", classID).Find(&problems).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถดึงข้อมูลโจทย์ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, problems)
}

// @Summary สร้าง test case สำหรับโจทย์
// @Description สร้าง test case ใหม่สำหรับโจทย์ที่ระบุ โดยต้องระบุ class_id, problem_id และ test_case_id ใน URL และส่งข้อมูล test case ใน request body
// @Tags test_cases
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case_id path int true "Test Case ID"
// @Param test_case body CreateTestCaseRequest true "ข้อมูล Test Case"
// @Success 200 {object} models.TestCase "Test Case ที่สร้างสำเร็จ"
// @Failure 400 {object} models.ErrorResponse "ข้อมูลที่ส่งมาไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบโจทย์"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/problems/{problem_id}/testcases/{test_case_id} [post]
func createTestCase(c *gin.Context) {
	problemID, err := strconv.Atoi(c.Param("problem_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "problem_id ไม่ถูกต้อง"})
		return
	}

	// ไม่ใช้ testCaseID จาก path เพื่อกำหนด ID เพราะ GORM จะจัดการให้
	_, err = strconv.Atoi(c.Param("test_case_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "test_case_id ไม่ถูกต้อง"})
		return
	}

	var problem models.Problem
	if err := database.DB.First(&problem, problemID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var input CreateTestCaseRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	testCase := models.TestCase{
		// ลบการกำหนด ID ออก
		ProblemID:      uint(problemID),
		InputData:      input.InputData,
		ExpectedOutput: input.ExpectedOutput,
		Description:    input.Description,
		IsPublic:       input.IsPublic,
	}

	if err := database.DB.Create(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถสร้าง test case ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, testCase)
}

// @Summary ลบ test case
// @Description ลบ test case สำหรับโจทย์ที่ระบุ โดยต้องระบุ class_id, problem_id, และ test_case_id ใน URL
// @Tags test_cases
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case_id path int true "Test Case ID"
// @Success 200 {object} map[string]string "ข้อความยืนยันการลบ"
// @Failure 400 {object} models.ErrorResponse "ID ไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาส, โจทย์, หรือ test case"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/{problem_id}/{test_case_id} [delete]
func deleteTestCase(c *gin.Context) {
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

	testCaseID, err := strconv.Atoi(c.Param("test_case_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "test_case_id ไม่ถูกต้อง"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var testCase models.TestCase
	if err := database.DB.Where("id = ? AND problem_id = ?", testCaseID, problemID).First(&testCase).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบ test case"})
		return
	}

	if err := database.DB.Delete(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถลบ test case ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, map[string]string{"message": "Success Remove test case"})
}

// @Summary ลบโจทย์
// @Description ลบโจทย์ที่ระบุ โดยต้องระบุ class_id และ problem_id ใน URL
// @Tags problems
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Success 200 {object} map[string]string "ข้อความยืนยันการลบ"
// @Failure 400 {object} models.ErrorResponse "ID ไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาสหรือโจทย์"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/{problem_id} [delete]
func deleteProblem(c *gin.Context) {
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

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	if err := database.DB.Delete(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถลบโจทย์ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, map[string]string{"message": "Success Remove Problem"})
}

// @Summary แก้ไขโจทย์
// @Description แก้ไขโจทย์ที่ระบุ โดยต้องระบุ class_id และ problem_id ใน URL และส่งข้อมูลโจทย์ที่ต้องการแก้ไขใน request body
// @Tags problems
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param problem body UpdateProblemRequest true "ข้อมูลโจทย์ที่ต้องการแก้ไข"
// @Success 200 {object} map[string]string "ข้อความยืนยันการแก้ไข"
// @Failure 400 {object} models.ErrorResponse "ข้อมูลที่ส่งมาไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาสหรือโจทย์"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/{problem_id} [put]
func updateProblem(c *gin.Context) {
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

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var input UpdateProblemRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	problem.Title = input.Title
	problem.Description = input.Description

	if err := database.DB.Save(&problem).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถแก้ไขโจทย์ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, map[string]string{"message": "edit problem success"})
}

// @Summary แก้ไข test case
// @Description แก้ไข test case สำหรับโจทย์ที่ระบุ โดยต้องระบุ class_id, problem_id, และ test_case_id ใน URL และส่งข้อมูล test case ที่ต้องการแก้ไขใน request body
// @Tags test_cases
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param class_id path int true "Class ID"
// @Param problem_id path int true "Problem ID"
// @Param test_case_id path int true "Test Case ID"
// @Param test_case body UpdateTestCaseRequest true "ข้อมูล Test Case ที่ต้องการแก้ไข"
// @Success 200 {object} map[string]string "ข้อความยืนยันการแก้ไข"
// @Failure 400 {object} models.ErrorResponse "ข้อมูลที่ส่งมาไม่ถูกต้อง"
// @Failure 401 {object} models.ErrorResponse "ไม่ได้รับอนุญาต (token ไม่ถูกต้อง)"
// @Failure 404 {object} models.ErrorResponse "ไม่พบคลาส, โจทย์, หรือ test case"
// @Failure 500 {object} models.ErrorResponse "ข้อผิดพลาดภายในเซิร์ฟเวอร์"
// @Router /api/{class_id}/{problem_id}/{test_case_id} [put]
func updateTestCase(c *gin.Context) {
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

	testCaseID, err := strconv.Atoi(c.Param("test_case_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "test_case_id ไม่ถูกต้อง"})
		return
	}

	var class models.Class
	if err := database.DB.First(&class, classID).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบคลาส"})
		return
	}

	var problem models.Problem
	if err := database.DB.Where("id = ? AND class_id = ?", problemID, classID).First(&problem).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบโจทย์"})
		return
	}

	var testCase models.TestCase
	if err := database.DB.Where("id = ? AND problem_id = ?", testCaseID, problemID).First(&testCase).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "ไม่พบ test case"})
		return
	}

	var input UpdateTestCaseRequest
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: "ข้อมูลที่ส่งมาไม่ถูกต้อง: " + err.Error()})
		return
	}

	testCase.InputData = input.InputData
	testCase.ExpectedOutput = input.ExpectedOutput
	testCase.Description = input.Description
	testCase.IsPublic = input.IsPublic

	if err := database.DB.Save(&testCase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{Error: "ไม่สามารถแก้ไข test case ได้: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, map[string]string{"message": "edit test case success"})
}

func RegisterProblemRoutes(r *gin.Engine) {
	problemGroup := r.Group("/api")
	// problemGroup := r.Group("/api", middleware.AuthMiddleware())
	{
		// เส้นทางสำหรับ Problem
		problemGroup.POST("/:class_id/problems/:problem_id", createProblem) // เปลี่ยนเป็น /api/:class_id/problems/:problem_id
		problemGroup.GET("/classes/:class_id/problem", getProblems)
		problemGroup.DELETE("/:class_id/problems/:problem_id", deleteProblem) // ปรับให้สอดคล้อง
		problemGroup.PUT("/:class_id/problems/:problem_id", updateProblem)    // ปรับให้สอดคล้อง

		// เส้นทางสำหรับ TestCase (ฝังอยู่ใน problem)
		problemGroup.POST("/:class_id/problems/:problem_id/testcases/:test_case_id", createTestCase)   // เปลี่ยนเป็น /api/:class_id/problems/:problem_id/testcases/:test_case_id
		problemGroup.DELETE("/:class_id/problems/:problem_id/testcases/:test_case_id", deleteTestCase) // ปรับให้สอดคล้อง
		problemGroup.PUT("/:class_id/problems/:problem_id/testcases/:test_case_id", updateTestCase)    // ปรับให้สอดคล้อง

	}
}
