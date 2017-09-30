package repository

import (
	"github.com/tspn/workhour/src/go/db"
	"gopkg.in/mgo.v2"
)

type SessionRepository struct {
	Database 	db.Database
	Collection	*mgo.Collection
}

func (SessionRepository) Create(database db.Database) SessionRepository{
	session := SessionRepository{}
	session.Database = database
	session.Collection = database.DB.C("session")
	return session
}