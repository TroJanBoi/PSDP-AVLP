package routes

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type RequestData struct {
	Instructions []string `json:"instructions"`
}

func RegisterAsmRoutes(r *gin.Engine) {
	asmGroup := r.Group("/asm")
	{
		asmGroup.POST("/execute", executeAssemblyHandler)
	}

}

func executeAssemblyHandler(c *gin.Context) {
	var req RequestData
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Received Instructions:", req.Instructions)

	registers := make(map[string]int)
	for _, instr := range req.Instructions {
		parts := strings.Fields(instr)
		if len(parts) < 3 {
			continue
		}

		reg := strings.TrimSuffix(parts[1], ",")

		switch parts[0] {
		case "MOV":
			mov(registers, reg, parts[2])
		case "ADD":
			add(registers, reg, parts[2])
		case "SUB":
			sub(registers, reg, parts[2])
		case "MUL":
			mul(registers, reg, parts[2])
		case "DIV":
			div(registers, reg, parts[2])
		}
	}
	fmt.Println("Registers:", registers)

	c.JSON(http.StatusOK, gin.H{"registers": registers})
}

func mov(registers map[string]int, reg string, valueStr string) {
	var value int
	num, err := strconv.Atoi(valueStr)
	if err != nil {
		value = registers[valueStr]
	} else {
		value = num
	}
	registers[reg] = value
}

func add(registers map[string]int, reg string, valueStr string) {
	var num int
	num, err := strconv.Atoi(valueStr)
	if err != nil {
		num = registers[valueStr]
	}
	currentValue := registers[reg]
	registers[reg] = currentValue + num
}

func sub(registers map[string]int, reg string, valueStr string) {
	var num int
	num, err := strconv.Atoi(valueStr)
	if err != nil {
		num = registers[valueStr]
	}
	currentValue := registers[reg]
	registers[reg] = currentValue - num
}

func mul(registers map[string]int, reg string, valueStr string) {
	var num int
	num, err := strconv.Atoi(valueStr)
	if err != nil {
		num = registers[valueStr]
	}
	currentValue := registers[reg]
	registers[reg] = currentValue * num
}

func div(registers map[string]int, reg string, valueStr string) {
	var num int
	num, err := strconv.Atoi(valueStr)
	if err != nil {
		num = registers[valueStr]
	}
	currentValue := registers[reg]
	registers[reg] = currentValue / num
}
