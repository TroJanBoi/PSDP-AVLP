package seed

import (
	"log"

	"example.com/greetings/database"
	"example.com/greetings/models"
	"golang.org/x/crypto/bcrypt"
)

// SeedData creates or updates a default admin user and seeds sample classes if they don't exist
func SeedData() {
	log.Println("Starting seeding process...")

	db := database.DB
	if db == nil {
		log.Fatal("Database connection is nil, cannot proceed with seeding")
	}

	// Hash the admin password
	log.Println("Hashing admin password...")
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("failed to hash admin password: %v", err)
	}

	// Check if the admin user exists
	log.Println("Checking if admin user exists...")
	var adminUser models.User
	if err := db.Where("username = ?", "admin").First(&adminUser).Error; err != nil {
		log.Println("Admin user does not exist, creating one...")
		// If the admin user doesn't exist, create one
		adminUser = models.User{
			Username: "admin",
			Password: string(hashedPassword),
			Email:    "admin@example.com",
			Name:     "Administrator",
			Bio:      "System Administrator",
		}
		if err := db.Create(&adminUser).Error; err != nil {
			log.Fatalf("failed to create admin user: %v", err)
		}
		log.Println("Created default admin user: username=admin, password=admin")
	} else {
		// If the admin user exists, update the password to ensure it matches
		log.Println("Admin user exists, updating password...")
		adminUser.Password = string(hashedPassword)
		if err := db.Save(&adminUser).Error; err != nil {
			log.Fatalf("failed to update admin user password: %v", err)
		}
		log.Println("Updated admin user password: username=admin, password=admin")
	}

	// Check if classes already exist
	log.Println("Checking if classes exist...")
	var classCount int64
	if err := db.Model(&models.Class{}).Count(&classCount).Error; err != nil {
		log.Fatalf("failed to count classes: %v", err)
	}
	log.Printf("Found %d classes in the database", classCount)
	if classCount > 0 {
		log.Println("Classes already exist, skipping seeding")
		return
	}

	// Seed sample classes related to Assembly
	classes := []models.Class{
		{
			Topic:       "Introduction to Assembly Language",
			Description: "Learn the basics of Assembly language, including syntax, registers, and basic instructions.",
			MaxPlayer:   20,
			IsPublic:    true,
			Img:         "/uploads/topic-class-1.png", // No image during seeding
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Arithmetic Operations",
			Description: "Explore arithmetic operations in Assembly, such as ADD, SUB, MUL, and DIV, with practical examples.",
			MaxPlayer:   15,
			IsPublic:    true,
			Img:         "/uploads/topic-class-2.png",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Control Flow",
			Description: "Understand control flow in Assembly using jumps, loops, and conditional statements.",
			MaxPlayer:   25,
			IsPublic:    true,
			Img:         "/uploads/topic-class-3.png",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Memory Management",
			Description: "Learn how to manage memory in Assembly, including stack operations and memory addressing modes.",
			MaxPlayer:   18,
			IsPublic:    true,
			Img:         "/uploads/topic-class-1.png",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Advanced Assembly Techniques",
			Description: "Dive into advanced Assembly topics like interrupts, system calls, and optimization techniques.",
			MaxPlayer:   10,
			IsPublic:    false,
			Img:         "/uploads/topic-class-2.png",
			OwnerID:     adminUser.ID,
		},
	}

	for _, class := range classes {
		if err := db.Create(&class).Error; err != nil {
			log.Fatalf("failed to create class %s: %v", class.Topic, err)
		}
	}
	log.Printf("Successfully seeded %d classes", len(classes))
}
