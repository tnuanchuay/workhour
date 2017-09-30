package model

type Work struct{
	Session 	string		`bson:"session"`
	StartTime 	int64		`bson:"startTime"`
	EndTime 	int64		`bson:"endTime"`
}

