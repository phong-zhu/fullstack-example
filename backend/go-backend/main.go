package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.POST("/api/v1/admin/login", handleAdmin)
	router.Run("127.0.0.1:8001")
}

func handleAdmin(c *gin.Context) {
	type adminBind struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var admin adminBind
	if err := c.BindJSON(&admin); err != nil {
		return
	}
	if admin.Username == "anonymous" {
		c.IndentedJSON(http.StatusOK, gin.H{"username": "anonymous", "message": "ok"})
		return
	} else {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"username": "anonymous", "message": "password incorrect"})
		return
	}
}
