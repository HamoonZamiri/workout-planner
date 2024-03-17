package main

import (
	"workout-planner/chat/api/handler"
	"workout-planner/chat/config"
)

// initial implementation borrowed from https://gowebexamples.com/websockets/
func main() {
	handler := handler.New()
	config.StartServer(handler)
}
