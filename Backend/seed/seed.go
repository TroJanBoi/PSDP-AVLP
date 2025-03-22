package seed

import (
	"log"

	"example.com/greetings/database"
	"example.com/greetings/models"
)

// SeedData creates a default admin user and sample classes if they don't exist
func SeedData() {
	db := database.DB

	// Check if the admin user exists
	var adminUser models.User
	if err := db.Where("username = ?", "admin").First(&adminUser).Error; err != nil {
		// Hash the admin password
		// hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin"), bcrypt.DefaultCost)
		// if err != nil {
		// 	log.Fatalf("failed to hash admin password: %v", err)
		// }

		// If the admin user doesn't exist, create one
		adminUser = models.User{
			Username: "admin",
			Password: "admin",
			Email:    "admin@example.com",
			Name:     "Administrator",
			Bio:      "System Administrator",
		}
		if err := db.Create(&adminUser).Error; err != nil {
			log.Fatalf("failed to create admin user: %v", err)
		}
		log.Println("Created default admin user: username=admin, password=admin")
	} else {
		log.Println("Admin user already exists, skipping creation")
	}

	// Check if classes already exist
	var classCount int64
	db.Model(&models.Class{}).Count(&classCount)
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
			Img:         "https://example.com/images/assembly-intro.jpg",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Arithmetic Operations",
			Description: "Explore arithmetic operations in Assembly, such as ADD, SUB, MUL, and DIV, with practical examples.",
			MaxPlayer:   15,
			IsPublic:    true,
			Img:         "https://example.com/images/assembly-arithmetic.jpg",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Control Flow",
			Description: "Understand control flow in Assembly using jumps, loops, and conditional statements.",
			MaxPlayer:   25,
			IsPublic:    true,
			Img:         "https://example.com/images/assembly-control-flow.jpg",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Assembly Memory Management",
			Description: "Learn how to manage memory in Assembly, including stack operations and memory addressing modes.",
			MaxPlayer:   18,
			IsPublic:    true,
			Img:         "https://example.com/images/assembly-memory.jpg",
			OwnerID:     adminUser.ID,
		},
		{
			Topic:       "Advanced Assembly Techniques",
			Description: "Dive into advanced Assembly topics like interrupts, system calls, and optimization techniques.",
			MaxPlayer:   10,
			IsPublic:    false,
			Img:         "https://example.com/images/assembly-advanced.jpg",
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
