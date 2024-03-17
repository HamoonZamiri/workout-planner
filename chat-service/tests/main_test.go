package main

import (
	"testing"
	"workout-planner/chat/clients"
	"workout-planner/chat/config"
)

func TestTwoClients(t *testing.T) {
	go config.StartServer()

	client1, err := clients.Connect("1")
	if err != nil {
		t.Error(err)
	}

	client2, err := clients.Connect("2")
	if err != nil {
		t.Error(err)
	}

	err = client1.SendMessage("2", "Hello")
	if err != nil {
		t.Error(err)
	}

	message, err := client2.ReceiveMessage()
	if err != nil {
		t.Error(err)
	}

	if message != "Hello" {
		t.Error("Message not received")
	}

	client1.CloseConn()
	client2.CloseConn()
}
