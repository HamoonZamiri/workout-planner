package config

import (
	"net/http"
	"path/filepath"
	"runtime"
	"workout-planner/chat/api/handler"
)

func StartServer(handler *handler.SocketHandler) {
	_, currentFile, _, _ := runtime.Caller(0)
	staticDir := filepath.Join(filepath.Dir(currentFile), "../static")

	http.HandleFunc("/echo", handler.HandleSocketConn)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(staticDir, "client1.html"))
	})
	http.HandleFunc("/user2", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, filepath.Join(staticDir, "client2.html"))
	})

	http.ListenAndServe(":8083", nil)
}
