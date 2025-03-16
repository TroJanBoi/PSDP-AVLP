package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `gorm:"index" json:"deleted_at"` // Nullable field
	Username  string     `gorm:"column:username;unique;not null" json:"username"`
	Password  string     `gorm:"column:password;not null" json:"password"`
	Email     string     `gorm:"column:email;unique" json:"email"`
	Name      string     `gorm:"column:name" json:"name"`
	Bio       string     `gorm:"column:bio" json:"bio"`
	Github    string     `gorm:"column:github" json:"github"`
	Youtube   string     `gorm:"column:youtube" json:"youtube"`
	Linkedin  string     `gorm:"column:linkedin" json:"linkedin"`
	Discord   string     `gorm:"column:discord" json:"discord"`
}

func (User) TableName() string {
	return "users"
}
