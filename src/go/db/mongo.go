package db

import (
	"gopkg.in/mgo.v2"
	"log"
)

type IDatabase interface {
	Create(Config)(Database)
}

type Database struct{
	Mongo 	*mgo.Session
	DB		*mgo.Database
}

func (Database) Create(config Config) (Database){
	d := mgo.DialInfo{
		Timeout:config.Timeout,
		Addrs:config.Addrs,
		Username:config.Username,
		Password:config.Password,
		Database:config.Database,
	}

	mongo, err := mgo.DialWithInfo(&d)
	if err != nil{
		log.Fatal(err)
	}

	mongo.SetMode(mgo.Monotonic, true)
	mdb :=  mongo.DB("workhour")
	db := Database{
		Mongo:mongo,
		DB:mdb,
	}
	return db
}