package models

type User struct {
	UserID   uint   `gorm:"column:user_id;primaryKey" json:"user_id"`
	Username string `gorm:"column:username;unique;not null" json:"username"`
	Password string `gorm:"column:password;not null" json:"password"`
	Email    string `gorm:"column:email;unique" json:"email"`
	Name     string `gorm:"column:name" json:"name"`
	Bio      string `gorm:"column:bio" json:"bio"`
	Github   string `gorm:"column:github" json:"github"`
	Youtube  string `gorm:"column:youtube" json:"youtube"`
	Linkedin string `gorm:"column:linkedin" json:"linkedin"`
	Discord  string `gorm:"column:discord" json:"discord"`
}

// กำหนดชื่อ Table ในฐานข้อมูล
func (User) TableName() string {
	return "users"
}
