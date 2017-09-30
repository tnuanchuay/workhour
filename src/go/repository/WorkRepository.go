package repository

import (
	"github.com/tspn/workhour/src/go/db"
	"gopkg.in/mgo.v2"
)

type WorkRepository struct {
	Database 	db.Database
	Collection	*mgo.Collection
}

func (WorkRepository) Create(database db.Database)WorkRepository{
	work := WorkRepository{}
	work.Database = database
	work.Collection = database.DB.C("work")
	return work
}
