package repository

import (
	"github.com/tspn/workhour/src/go/db"
	"gopkg.in/mgo.v2"
	"github.com/tspn/workhour/src/go/model"
	"time"
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

func (this WorkRepository)GetWorkByMonthYear(session string, month, year int) []model.Work{
	target := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC)
	unixTime := int64(target.UnixNano()/1000000)
	var result []model.Work
	this.Collection.Find(map[string]interface{}{
		"startTime":map[string]interface{}{
			"$gte":unixTime,
		},
		"session":session,
	}).All(&result)
	return result
}

