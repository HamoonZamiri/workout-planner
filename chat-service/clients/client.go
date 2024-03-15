package clients

import "github.com/gorilla/websocket"

type SocketClient struct {
	conn   *websocket.Conn
	userId string
}

func (c *SocketClient) GetConn() *websocket.Conn {
	return c.conn
}

func (c *SocketClient) GetUserId() string {
	return c.userId
}

func (c *SocketClient) CloseConn() {
	c.conn.Close()
}

func New(conn *websocket.Conn, userId string) *SocketClient {
	return &SocketClient{conn, userId}
}
