package handler

import (
	"fmt"
	"net/http"
	"workout-planner/chat/clients"

	"github.com/gorilla/websocket"
)

type SocketHandler struct {
	clientMap map[string]*clients.WebSocketClient
	upgrader  websocket.Upgrader
}

type Message struct {
	FromUser string `json:"fromUser"`
	ToUser   string `json:"toUser"`
	Content  string `json:"content"`
}

func New() *SocketHandler {
	return &SocketHandler{
		clientMap: make(map[string]*clients.WebSocketClient),
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
	}
}

func (h *SocketHandler) CloseConnection(client *clients.WebSocketClient, userId string) {
	if client != nil {
		client.CloseConn()
	}
	delete(h.clientMap, userId)
}

func (h *SocketHandler) HandleSocketConn(w http.ResponseWriter, r *http.Request) {
	conn, err := h.upgrader.Upgrade(w, r, nil)
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
	h.clientMap[userId] = socketClient

	defer h.CloseConnection(socketClient, userId)

	for {
		// Read message from browser
		var parsedMessage Message
		err := conn.ReadJSON(&parsedMessage)
		if err != nil {
			fmt.Println(err, "Problem reading json message")
			h.CloseConnection(socketClient, userId)
			return
		}

		// if the other user is still active send the message real-time
		if h.clientMap[parsedMessage.ToUser] != nil {
			receiver := h.clientMap[parsedMessage.ToUser]
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

func (h *SocketHandler) GetClient(userId string) *clients.WebSocketClient {
	return h.clientMap[userId]
}
