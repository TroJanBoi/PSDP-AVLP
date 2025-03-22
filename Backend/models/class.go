package models

import (
	"time"
)

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

func (Class) TableName() string {
	return "classes"
}
