package models

import (
	"time"
)

// ErrorResponse represents a generic error response
type ErrorResponse struct {
	Error string `json:"error"`
}

// SuccessResponse represents a generic success message
type SuccessResponse struct {
	Message string `json:"message"`
}

// LoginResponse represents the response for a successful login
type LoginResponse struct {
	Message string `json:"message"`
	User    User   `json:"user"`
}

// ForgotPasswordResponse represents the response for forgot password
type ForgotPasswordResponse struct {
	Message  string    `json:"message"`
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Time     time.Time `json:"time"`
}
