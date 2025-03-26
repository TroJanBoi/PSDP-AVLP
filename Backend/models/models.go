package models

import (
	"time"
)

// Class มี Problems (one-to-many)
// Problem มี TestCases (one-to-many)
// Problem เชื่อมโยงกับ Class และ User
// TestCase เชื่อมโยงกับ Problem

// User represents a user in the system
type User struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `gorm:"index" json:"deleted_at"` // Nullable field
	Username       string     `gorm:"column:username;unique;not null" json:"username"`
	Password       string     `gorm:"column:password;not null" json:"password"`
	Email          string     `gorm:"column:email;unique" json:"email"`
	Name           string     `gorm:"column:name" json:"name"`
	Bio            string     `gorm:"column:bio" json:"bio"`
	Github         string     `gorm:"column:github" json:"github"`
	Youtube        string     `gorm:"column:youtube" json:"youtube"`
	Linkedin       string     `gorm:"column:linkedin" json:"linkedin"`
	Discord        string     `gorm:"column:discord" json:"discord"`
	ProfilePicture string     `gorm:"column:profile_picture" json:"profile_picture"`
}

type Class struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `gorm:"index" json:"deleted_at"`
	Topic       string     `gorm:"column:topic;not null" json:"topic"`
	Description string     `gorm:"column:description" json:"description"`
	MaxPlayer   int        `gorm:"column:max_player;not null" json:"max_player"`
	IsPublic    bool       `gorm:"column:is_public;default:true" json:"isPublic"`
	Img         string     `gorm:"column:img" json:"img"`
	OwnerID     uint       `gorm:"column:owner_id;not null" json:"owner_id"` // Foreign key
	Owner       User       `gorm:"foreignKey:OwnerID" json:"owner"`          // Relationship
}

// Problem represents a problem in a class
type Problem struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	DeletedAt   *time.Time `gorm:"index" json:"deleted_at"`
	ClassID     uint       `json:"class_id" gorm:"index"`
	Class       Class      `json:"class" gorm:"foreignKey:ClassID"`
	UserID      uint       `json:"user_id" gorm:"index"`
	User        User       `json:"user" gorm:"foreignKey:UserID"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	TestCases   []TestCase `json:"test_cases" gorm:"foreignKey:ProblemID"`
}

// TestCase represents a test case for a problem
type TestCase struct {
	ID             uint       `json:"id" gorm:"primaryKey"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	DeletedAt      *time.Time `gorm:"index" json:"deleted_at"`
	ProblemID      uint       `json:"problem_id" gorm:"index"`
	Problem        Problem    `json:"problem" gorm:"foreignKey:ProblemID"`
	InputData      string     `json:"input_data"`
	ExpectedOutput string     `json:"expected_output"`
	Description    string     `json:"description"`
	IsPublic       bool       `json:"is_public"`
}

// func (User) TableName() string {
// 	return "users"
// }

// Add to models/models.go
type ProblemAttempt struct {
	ID            uint       `gorm:"primaryKey" json:"attempt_id"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
	DeletedAt     *time.Time `gorm:"index" json:"deleted_at"`
	ProblemID     uint       `json:"problem_id" gorm:"index"`
	Problem       Problem    `json:"problem" gorm:"foreignKey:ProblemID"`
	UserID        uint       `json:"user_id" gorm:"index"`
	User          User       `json:"user" gorm:"foreignKey:UserID"`
	InputData     string     `json:"input_data"`
	StartedAt     time.Time  `json:"started_at"`
	CompleteAt    *time.Time `json:"complete_at"`    // Nullable
	ScoreObtained int        `json:"score_obtained"` // Nullable
}
