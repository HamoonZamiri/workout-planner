package main

import (
	"workout-planner/chat/api/handler"
	"workout-planner/chat/config"
	"workout-planner/chat/database"
	"workout-planner/chat/service"
)

func main() {
	db, err := database.New()
	if err != nil {
		panic(err)
	}
	msgService := service.NewMessageService(db)

	handler := handler.New(msgService)
	config.StartServer(handler)
}
