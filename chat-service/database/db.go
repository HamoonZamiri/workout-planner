package database

import (
	"errors"
	"workout-planner/chat/models"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var schema = `
  CREATE TABLE IF NOT EXISTS message (
    id uuid primary key unique default gen_random_uuid(),
    from_user uuid,
    to_user uuid,
    content text,
    created_at timestamp default now()
  );`

func New() (*sqlx.DB, error) {
	db, err := sqlx.Connect("postgres", "user=postgres dbname=chat_service sslmode=disable")
	if err != nil {
		return nil, err
	}
	db.MustExec(schema)
	return db, nil
}

func NewDbMessage(from, to uuid.UUID, content string) *models.CreateMessage {
	return &models.CreateMessage{
		Content: content,
		From:    from,
		To:      to,
	}
}

func InsertMessage(db *sqlx.DB, message models.CreateMessage) error {
	_, err := db.NamedExec("INSERT INTO message (from_user, to_user, content) VALUES (:from,:to,:content)", message)
	if err != nil {
		return err
	}
	return nil
}

func GetMessageById(db *sqlx.DB, id uuid.UUID) (*models.DBMessage, error) {
	message := models.DBMessage{}
	err := db.Get(&message, "SELECT * FROM message WHERE id = $1", id)
	if err != nil {
		return nil, err
	}
	return &message, nil
}

func GetMessageHistory(db *sqlx.DB, from, to uuid.UUID) (*[]models.DBMessage, error) {
	messages := []models.DBMessage{}
	err := db.Select(&messages, "SELECT * FROM message WHERE (from = $1 AND to = $2 OR from = $2 AND to = $1) ORDER BY created_at", from, to)
	if err != nil {
		return nil, err
	}
	if len(messages) == 0 {
		return nil, errors.New("no message history found between the two users")
	}

	return &messages, nil
}
