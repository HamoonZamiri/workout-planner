package main

import (
	"testing"
	"workout-planner/chat/api/handler"
	"workout-planner/chat/clients"
	"workout-planner/chat/config"
	"workout-planner/chat/database"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

var h *handler.SocketHandler

func init() {
	db, err := database.New()
	if err != nil {
		panic(err)
	}
	h = handler.New(db)
	go config.StartServer(h)
}

func TestClientConnect(t *testing.T) {
	id := uuid.New()
	client, err := clients.Connect(id)
	assert.Nil(t, err)
	assert.NotNil(t, client)
}

func TestClientDisconnect(t *testing.T) {
	id := uuid.New()
	client, err := clients.Connect(id)
	assert.Nil(t, err)
	assert.NotNil(t, client)
	h.CloseConnection(client, id)

	client = h.GetClient(id)
	assert.Nil(t, client)
}

func TestTwoClients(t *testing.T) {
	id1 := uuid.New()
	id2 := uuid.New()
	client1, err := clients.Connect(id1)
	assert.Nil(t, err)

	client2, err := clients.Connect(id2)
	assert.Nil(t, err)

	err = client1.SendMessage(id2, "Hello")
	assert.Nil(t, err)

	message, err := client2.ReceiveMessage()
	assert.Nil(t, err)

	assert.Equal(t, "Hello", message, "Message should be 'Hello'")
}
