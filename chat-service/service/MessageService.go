package service

import (
	"workout-planner/chat/database"
	"workout-planner/chat/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type messageService struct {
	db *sqlx.DB
}

type MessageService interface {
	SendMessage(from, to uuid.UUID, content string) error
	GetMessageHistory(from, to uuid.UUID) (*[]models.DBMessage, error)
	GetMessageById(id uuid.UUID) (*models.DBMessage, error)
}

func NewMessageService(db *sqlx.DB) MessageService {
	return &messageService{db}
}

func (ms *messageService) SendMessage(from, to uuid.UUID, content string) error {
	dbMessage := database.NewDbMessage(from, to, content)
	err := database.InsertMessage(ms.db, *dbMessage)
	if err != nil {
		return err
	}
	return nil
}

func (ms *messageService) GetMessageHistory(from, to uuid.UUID) (*[]models.DBMessage, error) {
	messages, err := database.GetMessageHistory(ms.db, from, to)
	if err != nil {
		return nil, err
	}
	return messages, nil
}

func (ms *messageService) GetMessageById(id uuid.UUID) (*models.DBMessage, error) {
	message, err := database.GetMessageById(ms.db, id)
	if err != nil {
		return nil, err
	}
	return message, nil
}
