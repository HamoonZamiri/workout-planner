package models

import "github.com/google/uuid"

type DBMessage struct {
	Content  string    `db:"content"`
	FromUser uuid.UUID `db:"from_user"`
	ToUser   uuid.UUID `db:"to_user"`
	ID       uuid.UUID `db:"id"`
}

type CreateMessage struct {
	Content string
	From    uuid.UUID
	To      uuid.UUID
}
