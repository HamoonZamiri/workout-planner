package handler

import (
	"fmt"
	"net/http"
	"workout-planner/chat/clients"
	"workout-planner/chat/service"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type SocketHandler struct {
	msgService service.MessageService
	clientMap  map[uuid.UUID]*clients.WebSocketClient
	upgrader   websocket.Upgrader
}

type Message struct {
	Content  string    `json:"content"`
	FromUser uuid.UUID `json:"fromUser"`
	ToUser   uuid.UUID `json:"toUser"`
}

func New(msgService service.MessageService) *SocketHandler {
	return &SocketHandler{
		clientMap: make(map[uuid.UUID]*clients.WebSocketClient),
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		},
		msgService: msgService,
	}
}

func (h *SocketHandler) CloseConnection(client *clients.WebSocketClient, userId uuid.UUID) {
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

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		fmt.Println("User ID not valid")
		return
	}

	fmt.Printf("User %s connected\n", userId)

	socketClient := clients.NewSocketClient(conn, userUUID)
	h.clientMap[userUUID] = socketClient

	defer h.CloseConnection(socketClient, userUUID)

	for {
		// Read message from browser
		var parsedMessage Message
		err := conn.ReadJSON(&parsedMessage)
		if err != nil {
			fmt.Println(err, "Problem reading json message")
			h.CloseConnection(socketClient, userUUID)
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
		h.msgService.SendMessage(parsedMessage.FromUser, parsedMessage.ToUser, parsedMessage.Content)

		// Print the message to the console
		fmt.Printf("%s id=%s sent: %s to %s\n", conn.RemoteAddr(), parsedMessage.FromUser, parsedMessage.Content, parsedMessage.ToUser)
	}
}

func (h *SocketHandler) GetClient(userId uuid.UUID) *clients.WebSocketClient {
	return h.clientMap[userId]
}
