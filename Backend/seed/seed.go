package seed

import (
	"fmt"
	"log"
	"time"

	"example.com/greetings/models" // ปรับตาม path จริงของโปรเจกต์คุณ
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedData creates or updates a default admin user and seeds sample Assembly-related classes, problems, and test cases
func SeedData(db *gorm.DB) {
	// Hash password for admin
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash admin password: %v", err)
	}

	// 1. Seed User: admin
	var admin models.User
	if err := db.Where("username = ?", "admin").First(&admin).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			admin = models.User{
				Username:       "admin",
				Password:       string(hashedPassword),
				Email:          "admin@example.com",
				Name:           "Admin User",
				Bio:            "Administrator of the system",
				Github:         "github.com/admin",
				ProfilePicture: "http://example.com/admin.jpg",
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
			}
			if err := db.Create(&admin).Error; err != nil {
				panic("Failed to create admin user: " + err.Error())
			}
			fmt.Println("Created admin user")
		} else {
			panic("Error checking admin user: " + err.Error())
		}
	} else {
		admin.UpdatedAt = time.Now()
		if err := db.Save(&admin).Error; err != nil {
			panic("Failed to update admin user: " + err.Error())
		}
		fmt.Println("Admin user already exists, updated timestamp")
	}

	// 2. Seed User: Patipan
	hashedPatipanPassword, err := bcrypt.GenerateFromPassword([]byte("123"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash Patipan password: %v", err)
	}
	var patipan models.User
	if err := db.Where("username = ?", "Patipan").First(&patipan).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			patipan = models.User{
				Username:       "Patipan",
				Password:       string(hashedPatipanPassword),
				Email:          "ddpatipan@gmail.com",
				Name:           "Patipan",
				Bio:            "Assembly enthusiast",
				Github:         "github.com/patipan",
				ProfilePicture: "http://example.com/patipan.jpg",
				CreatedAt:      time.Now(),
				UpdatedAt:      time.Now(),
			}
			if err := db.Create(&patipan).Error; err != nil {
				panic("Failed to create Patipan user: " + err.Error())
			}
			fmt.Println("Created Patipan user")
		} else {
			panic("Error checking Patipan user: " + err.Error())
		}
	} else {
		patipan.UpdatedAt = time.Now()
		if err := db.Save(&patipan).Error; err != nil {
			panic("Failed to update Patipan user: " + err.Error())
		}
		fmt.Println("Patipan user already exists, updated timestamp")
	}

	// 3. Seed Classes
	classes := []models.Class{
		{
			Topic:       "Introduction to Assembly Language",
			Description: "Learn the basics of Assembly programming",
			MaxPlayer:   40,
			IsPublic:    true,
			Img:         "/uploads/topic-class-3.png",
			OwnerID:     patipan.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Topic:       "Assembly Arithmetic Operations",
			Description: "Master ADD, SUB, MUL, and DIV in Assembly",
			MaxPlayer:   35,
			IsPublic:    true,
			Img:         "/uploads/topic-class-1.png",
			OwnerID:     admin.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Topic:       "Control Flow in Assembly",
			Description: "Understand jumps, loops, and conditionals",
			MaxPlayer:   30,
			IsPublic:    true,
			Img:         "/uploads/topic-class-2.png",
			OwnerID:     admin.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Topic:       "Assembly Memory Management",
			Description: "Learn stack, heap, and memory addressing",
			MaxPlayer:   25,
			IsPublic:    true,
			Img:         "/uploads/topic-class-3.png",
			OwnerID:     admin.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			Topic:       "Interfacing Assembly with Hardware",
			Description: "Explore low-level hardware programming",
			MaxPlayer:   20,
			IsPublic:    true,
			Img:         "/uploads/topic-class-1.png",
			OwnerID:     admin.ID,
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for i, class := range classes {
		var existingClass models.Class
		if err := db.Where("topic = ? AND owner_id = ?", class.Topic, class.OwnerID).First(&existingClass).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&class).Error; err != nil {
					panic("Failed to create class '" + class.Topic + "': " + err.Error())
				}
				fmt.Printf("Created class: %s\n", class.Topic)
				classes[i] = class // อัปเดต ID หลังจากสร้าง
			} else {
				panic("Error checking class '" + class.Topic + "': " + err.Error())
			}
		} else {
			classes[i] = existingClass // ใช้ ID ที่มีอยู่แล้ว
			existingClass.UpdatedAt = time.Now()
			if err := db.Save(&existingClass).Error; err != nil {
				panic("Failed to update class '" + class.Topic + "': " + err.Error())
			}
			fmt.Printf("Class '%s' already exists, updated timestamp\n", class.Topic)
		}
	}

	// 4. Seed Problems (10 problems)
	problems := []models.Problem{
		{
			ClassID:     classes[0].ID,
			UserID:      patipan.ID,
			Title:       "Hello World in Assembly",
			Description: "Write a program to print 'Hello World' to the console",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[1].ID,
			UserID:      admin.ID,
			Title:       "Add Two Numbers",
			Description: "Write a program to add two integers",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[1].ID,
			UserID:      admin.ID,
			Title:       "Subtract Two Numbers",
			Description: "Write a program to subtract two integers",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[2].ID,
			UserID:      admin.ID,
			Title:       "Simple Loop",
			Description: "Write a program to print numbers from 1 to 10 using a loop",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[2].ID,
			UserID:      admin.ID,
			Title:       "Conditional Jump",
			Description: "Write a program to compare two numbers and print the larger one",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[3].ID,
			UserID:      admin.ID,
			Title:       "Stack Push and Pop",
			Description: "Write a program to push and pop a value from the stack",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[3].ID,
			UserID:      admin.ID,
			Title:       "Memory Addressing",
			Description: "Write a program to store and retrieve a value from memory",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[4].ID,
			UserID:      admin.ID,
			Title:       "LED Blink",
			Description: "Write a program to blink an LED on a hardware device",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[4].ID,
			UserID:      admin.ID,
			Title:       "Button Input",
			Description: "Write a program to read input from a button",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
		{
			ClassID:     classes[0].ID,
			UserID:      patipan.ID,
			Title:       "Reverse String",
			Description: "Write a program to reverse a string in Assembly",
			CreatedAt:   time.Now(),
			UpdatedAt:   time.Now(),
		},
	}

	for i, problem := range problems {
		var existingProblem models.Problem
		if err := db.Where("title = ? AND class_id = ?", problem.Title, problem.ClassID).First(&existingProblem).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&problem).Error; err != nil {
					panic("Failed to create problem '" + problem.Title + "': " + err.Error())
				}
				fmt.Printf("Created problem: %s\n", problem.Title)
				problems[i] = problem // อัปเดต ID หลังจากสร้าง
			} else {
				panic("Error checking problem '" + problem.Title + "': " + err.Error())
			}
		} else {
			problems[i] = existingProblem // ใช้ ID ที่มีอยู่แล้ว
			existingProblem.UpdatedAt = time.Now()
			if err := db.Save(&existingProblem).Error; err != nil {
				panic("Failed to update problem '" + problem.Title + "': " + err.Error())
			}
			fmt.Printf("Problem '%s' already exists, updated timestamp\n", problem.Title)
		}
	}

	// 5. Seed Test Cases (1 test case per problem)
	testCases := []models.TestCase{
		{
			ProblemID:      problems[0].ID,
			InputData:      "",
			ExpectedOutput: "Hello World",
			Description:    "Prints Hello World",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[1].ID,
			InputData:      "3 5",
			ExpectedOutput: "8",
			Description:    "Adds 3 and 5",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[2].ID,
			InputData:      "10 4",
			ExpectedOutput: "6",
			Description:    "Subtracts 4 from 10",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[3].ID,
			InputData:      "",
			ExpectedOutput: "1 2 3 4 5 6 7 8 9 10",
			Description:    "Prints numbers 1 to 10",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[4].ID,
			InputData:      "7 3",
			ExpectedOutput: "7",
			Description:    "Compares 7 and 3, prints 7",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[5].ID,
			InputData:      "42",
			ExpectedOutput: "42",
			Description:    "Pushes 42 to stack and pops it",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[6].ID,
			InputData:      "100",
			ExpectedOutput: "100",
			Description:    "Stores 100 in memory and retrieves it",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[7].ID,
			InputData:      "",
			ExpectedOutput: "blink",
			Description:    "Blinks LED once",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[8].ID,
			InputData:      "1",
			ExpectedOutput: "pressed",
			Description:    "Reads button press (1) and outputs 'pressed'",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
		{
			ProblemID:      problems[9].ID,
			InputData:      "hello",
			ExpectedOutput: "olleh",
			Description:    "Reverses the string 'hello'",
			IsPublic:       true,
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		},
	}

	for _, testCase := range testCases {
		var existingTestCase models.TestCase
		if err := db.Where("problem_id = ? AND description = ?", testCase.ProblemID, testCase.Description).First(&existingTestCase).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&testCase).Error; err != nil {
					panic("Failed to create test case for problem ID " + fmt.Sprint(testCase.ProblemID) + ": " + err.Error())
				}
				fmt.Printf("Created test case for problem ID %d\n", testCase.ProblemID)
			} else {
				panic("Error checking test case for problem ID " + fmt.Sprint(testCase.ProblemID) + ": " + err.Error())
			}
		} else {
			existingTestCase.UpdatedAt = time.Now()
			if err := db.Save(&existingTestCase).Error; err != nil {
				panic("Failed to update test case for problem ID " + fmt.Sprint(testCase.ProblemID) + ": " + err.Error())
			}
			fmt.Printf("Test case for problem ID %d already exists, updated timestamp\n", testCase.ProblemID)
		}
	}

	fmt.Println("Seeding completed successfully! Admin user, Patipan user, 5 classes, 10 problems, and 10 test cases processed.")
}
