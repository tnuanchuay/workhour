package repository

import (
	"github.com/tspn/workhour/src/go/db"
	"gopkg.in/mgo.v2"
)

type UserRepository struct{
	Database db.Database
	Collection	*mgo.Collection
}

func (UserRepository) Create(database db.Database) UserRepository{
	user := UserRepository{}
	user.Database = database
	user.Collection = user.Database.DB.C("user")
	return user
}
