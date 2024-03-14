package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// initial implementation borrowed from https://gowebexamples.com/websockets/
func main() {
	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			panic(err)
		}

		for {
			// Read message from browser
			messageType, message, err := conn.ReadMessage()
			if err != nil {
				panic(err)
			}

			// Print the message to the console
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(message))

			serverMessage := []byte(fmt.Sprintf("You sent: %s", string(message)))
			if err = conn.WriteMessage(messageType, serverMessage); err != nil {
				fmt.Println(err)
			}
		}
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/index.html")
	})

	http.ListenAndServe(":8083", nil)
}
