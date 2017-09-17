package main

import (
	"github.com/valyala/fasthttp"
	"encoding/json"
	"log"
)

func API_AverageWorkHourPerWeek(ctx *fasthttp.RequestCtx){
	mongo, db := createMongoSession()
	defer mongo.Close()

	sessionId := ctx.Request.Header.Cookie("SESSIONID")

	var works []Work

	session := db.C("work")
	session.Find(map[string]string{
		"session" : string(sessionId),
	}).Limit(30).All(&works)

	res, err := json.Marshal(map[string]interface{}{
		"data" : works,
	})

	if err != nil{
		log.Fatal(err)
		ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
	}else{
		ctx.Write(res)
	}
}
