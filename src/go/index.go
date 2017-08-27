package main

import (
	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
	"fmt"
	"log"
	"encoding/json"
	"crypto/sha512"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

func main(){
	router := fasthttprouter.New()
	mongo, err := mgo.DialWithInfo(&mgo.DialInfo{
		Addrs:Addrs,
		Database:Database,
		Timeout:Timeout,
		Username:Username,
		Password:Password,
	})

	if err != nil {
		panic(err)
	}
	defer mongo.Close()

	db := mongo.DB("workhour")

	mongo.SetMode(mgo.Monotonic, true)

	router.GET("/version", func (ctx *fasthttp.RequestCtx){
		ctx.WriteString(version)
	})

	router.POST("/auth", func(ctx *fasthttp.RequestCtx) {
		shagen := sha512.New()
		preToken := ctx.FormValue("pre-token")
		em := fmt.Sprintf("%s", preToken)
		shagen.Write([]byte(em))
		token := fmt.Sprintf("%x", shagen.Sum(nil))
		b, err := json.Marshal(map[string]interface{}{
			"token" : token,
		})
		if err != nil {
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}

		c := db.C("user")
		count, err := c.Find(map[string]string{"token":token }).Count()
		if err != nil{
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}

		if count == 0 {
			err = c.Insert(map[string]string{"token":token })
		}

		if err != nil{
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		}else{
			ctx.Write(b)
		}
	})

	router.POST("/work", func(ctx *fasthttp.RequestCtx) {
		fmt.Println("hi")
		session := fmt.Sprintf("%x", ctx.Request.Header.Peek("SESSIONID"))
		startTime := string(ctx.FormValue("startTime"))
		endTime := string(ctx.FormValue("endTime"))
		c := db.C("work")
		err := c.Insert(bson.M{"session": session, "startTime": startTime, "endTime": endTime})

		if err != nil {

			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}

		json, err := json.Marshal(map[string]interface{}{
			"status": "ok",
		})

		if err != nil{
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		}else{
			ctx.Write(json)
		}
	})

	var cors Middleware
	cors.Next = router.Handler
	cors.Function = func(m *Middleware, ctx *fasthttp.RequestCtx){
		ctx.Response.Header.Add("Access-Control-Allow-Origin", "*")
		fmt.Println(string(ctx.Path()))
		m.Next(ctx)
	}

	log.Fatal(fasthttp.ListenAndServe(port, cors.Handler))
}