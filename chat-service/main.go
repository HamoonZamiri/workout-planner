package main

import (
	"fmt"
	"net/http"
	"workout-planner/chat/clients"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clientMap = make(map[string]*clients.WebSocketClient)

type Message struct {
	FromUser string `json:"fromUser"`
	ToUser   string `json:"toUser"`
	Content  string `json:"content"`
}

func closeConnection(client *clients.WebSocketClient) {
	client.CloseConn()
	delete(clientMap, client.GetUserId())
}

func handleSocketConn(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Printf("Error: %s\n", err)
	}

	userId := r.URL.Query().Get("userId")
	if userId == "" {
		fmt.Println("User ID not found")
		return
	}

	fmt.Printf("User %s connected\n", userId)

	socketClient := clients.NewSocketClient(conn, userId)
	clientMap[userId] = socketClient

	defer closeConnection(socketClient)

	for {
		// Read message from browser
		var parsedMessage Message
		err := conn.ReadJSON(&parsedMessage)
		if err != nil {
			fmt.Println(err, "Problem reading json message")
			return
		}

		// if the other user is still active send the message real-time
		if clientMap[parsedMessage.ToUser] != nil {
			receiver := clientMap[parsedMessage.ToUser]
			err = receiver.GetConn().WriteMessage(websocket.TextMessage, []byte(parsedMessage.Content))
			if err != nil {
				fmt.Println(err, "Problem sending message to receiver")
				return
			}
		}

		// TODO: save the message to the database

		// Print the message to the console
		fmt.Printf("%s id=%s sent: %s to %s\n", conn.RemoteAddr(), parsedMessage.FromUser, parsedMessage.Content, parsedMessage.ToUser)
	}
}

func startServer() {
	http.HandleFunc("/echo", handleSocketConn)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/client1.html")
	})
	http.HandleFunc("/user2", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/client2.html")
	})

	http.ListenAndServe(":8083", nil)
}

// initial implementation borrowed from https://gowebexamples.com/websockets/
func main() {
	startServer()
}
