package main

import (
	"workout-planner/chat/api/handler"
	"workout-planner/chat/config"
	"workout-planner/chat/database"
)

func main() {
	db, err := database.New()
	if err != nil {
		panic(err)
	}

	handler := handler.New(db)
	config.StartServer(handler)
}
