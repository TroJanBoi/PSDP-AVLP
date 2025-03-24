package main

import (
	"log"
	"os"
	"os/exec"
)

// GenerateSwaggerDocs รันคำสั่ง swag init เพื่อสร้าง Swagger docs สำหรับทุก tag และกรณีทั่วไป
func GenerateSwaggerDocs() {
	// รันคำสั่ง swag init สำหรับ Users
	log.Println("Generating Swagger docs for Users...")
	cmd := exec.Command("swag", "init", "--tags", "Users", "-o", "docs/users")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run swag init for Users: %v", err)
	}
	log.Println("Swagger docs for Users generated successfully")

	// รันคำสั่ง swag init สำหรับ Classes
	log.Println("Generating Swagger docs for Classes...")
	cmd = exec.Command("swag", "init", "--tags", "Classes", "-o", "docs/classes")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run swag init for Classes: %v", err)
	}
	log.Println("Swagger docs for Classes generated successfully")

	// รันคำสั่ง swag init สำหรับ Problems
	log.Println("Generating Swagger docs for Problems...")
	cmd = exec.Command("swag", "init", "--tags", "Problems", "-o", "docs/problems")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run swag init for Problems: %v", err)
	}
	log.Println("Swagger docs for Problems generated successfully")

	// รันคำสั่ง swag init สำหรับ Test_case
	log.Println("Generating Swagger docs for Test_case...")
	cmd = exec.Command("swag", "init", "--tags", "Test_case", "-o", "docs/test_case")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run swag init for Test_case: %v", err)
	}
	log.Println("Swagger docs for Test_case generated successfully")

	// รันคำสั่ง swag init สำหรับกรณีทั่วไป (ทั้งหมด)
	log.Println("Generating Swagger docs for all...")
	cmd = exec.Command("swag", "init", "-o", "docs")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		log.Fatalf("failed to run swag init for all: %v", err)
	}
	log.Println("Swagger docs for all generated successfully")
}
