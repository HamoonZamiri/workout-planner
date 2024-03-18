package clients

import (
	"fmt"
	"net/url"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type WebSocketClient struct {
	conn   *websocket.Conn
	userId uuid.UUID
}

type Message struct {
	Content  string    `json:"content"`
	FromUser uuid.UUID `json:"fromUser"`
	ToUser   uuid.UUID `json:"toUser"`
}

func (c *WebSocketClient) GetConn() *websocket.Conn {
	return c.conn
}

func (c *WebSocketClient) GetUserId() uuid.UUID {
	return c.userId
}

func (c *WebSocketClient) CloseConn() {
	c.conn.Close()
}

func NewSocketClient(conn *websocket.Conn, userId uuid.UUID) *WebSocketClient {
	return &WebSocketClient{conn, userId}
}

func Connect(userId uuid.UUID) (*WebSocketClient, error) {
	u := url.URL{Scheme: "ws", Host: "localhost:8083", Path: "/echo"}
	query := u.Query()
	query.Set("userId", userId.String())
	u.RawQuery = query.Encode()

	conn, res, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		fmt.Println(res.Request.URL)
		return nil, err
	}

	return &WebSocketClient{conn, userId}, nil
}

func (c *WebSocketClient) SendMessage(toUser uuid.UUID, content string) error {
	message := Message{
		Content:  content,
		FromUser: c.userId,
		ToUser:   toUser,
	}
	return c.conn.WriteJSON(message)
}

func (c *WebSocketClient) ReceiveMessage() (string, error) {
	c.conn.SetReadDeadline(time.Now().Add(5 * time.Second))
	_, message, err := c.conn.ReadMessage()
	if err != nil {
		return "", err
	}
	return string(message), nil
}
