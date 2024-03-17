package main

import (
	"testing"
	"workout-planner/chat/api/handler"
	"workout-planner/chat/clients"
	"workout-planner/chat/config"

	"github.com/stretchr/testify/assert"
)

var h *handler.SocketHandler

func init() {
	h = handler.New()
	go config.StartServer(h)
}

func TestClientConnect(t *testing.T) {
	client, err := clients.Connect("1")
	assert.Nil(t, err)
	assert.NotNil(t, client)
}

func TestClientDisconnect(t *testing.T) {
	client, err := clients.Connect("1")
	assert.Nil(t, err)
	assert.NotNil(t, client)
	h.CloseConnection(client, "1")

	client = h.GetClient("1")
	assert.Nil(t, client)
}

func TestTwoClients(t *testing.T) {
	client1, err := clients.Connect("1")
	assert.Nil(t, err)

	client2, err := clients.Connect("2")
	assert.Nil(t, err)

	err = client1.SendMessage("2", "Hello")
	assert.Nil(t, err)

	message, err := client2.ReceiveMessage()
	assert.Nil(t, err)

	assert.Equal(t, "Hello", message, "Message should be 'Hello'")
}
