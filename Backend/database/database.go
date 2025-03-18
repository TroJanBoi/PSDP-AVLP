package database

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

const (
	host = "postgres"
	// host     = "localhost"
	username = "myuser"
	password = "mypassword"
	dbname   = "mydatabase"
	port     = 5432
)

func ConnectDatabase() {
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
