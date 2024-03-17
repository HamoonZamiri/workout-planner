package config

import (
	"net/http"
	"workout-planner/chat/api/handler"
)

func StartServer(handler *handler.SocketHandler) {
	http.HandleFunc("/echo", handler.HandleSocketConn)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../static/client1.html")
	})
	http.HandleFunc("/user2", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../static/client2.html")
	})

	http.ListenAndServe(":8083", nil)
}
