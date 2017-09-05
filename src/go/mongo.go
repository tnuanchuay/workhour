package main

import (
	"gopkg.in/mgo.v2"
	"log"
)

func createMongoSession() (*mgo.Session, *mgo.Database){
	mongo, err := mgo.DialWithInfo(&mgo.DialInfo{
		Addrs:Addrs,
		Database:Database,
		Timeout:Timeout,
		Username:Username,
		Password:Password,
	})

	if err != nil{
		log.Fatal(err)
	}

	mongo.SetMode(mgo.Monotonic, true)
	db := mongo.DB("workhour")

	return mongo, db
}
