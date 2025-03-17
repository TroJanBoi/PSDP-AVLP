package database

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDatabase() {
	// โหลด .env ถ้ามี (สำหรับ terminal)
	_ = godotenv.Load()

	// อ่านค่าจาก environment variables หรือใช้ default
	host := getEnv("DB_HOST", "localhost")             // Default เป็น localhost สำหรับ terminal
	port, _ := strconv.Atoi(getEnv("DB_PORT", "5432")) // Default เป็น 5432
	username := getEnv("DB_USER", "myuser")
	password := getEnv("DB_PASSWORD", "mypassword")
	dbname := getEnv("DB_NAME", "mydatabase")

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, dbname)
	var err error

	newLogger := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Info,
			Colorful:      true,
		},
	)
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		log.Fatalf("failed to connect to database: %v\n", err)
	}

	fmt.Println("Connect database successful")

	go monitorConnection()
}

// getEnv อ่าน environment variable หรือใช้ default
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func monitorConnection() {
	for {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Printf("error when get sqlDB: %v\n", err)
		} else {
			if err := sqlDB.Ping(); err != nil {
				log.Printf("Connection lost: %v\n", err)
				reconnectDatabase()
			}
		}
		time.Sleep(2 * time.Minute)
	}
}

func reconnectDatabase() {
	for {
		host := getEnv("DB_HOST", "localhost")
		port, _ := strconv.Atoi(getEnv("DB_PORT", "5432"))
		username := getEnv("DB_USER", "myuser")
		password := getEnv("DB_PASSWORD", "mypassword")
		dbname := getEnv("DB_NAME", "mydatabase")

		dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, username, password, dbname)
		newLogger := logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: time.Second,
				LogLevel:      logger.Info,
				Colorful:      true,
			},
		)
		var err error
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: newLogger,
		})
		if err == nil {
			log.Println("Reconnect successful")
			break
		}
		log.Printf("Reconnect ล้มเหลว: %v\n", err)
		time.Sleep(5 * time.Second)
	}
}
