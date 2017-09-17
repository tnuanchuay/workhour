package main

type Work struct{
	Session 	string
	StartTime 	int64		`bson:"startTime"`
	EndTime 	int64		`bson:"endTime"`
}