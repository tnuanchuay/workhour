package main

import (
	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
	"fmt"
	"log"
	"encoding/json"
	"crypto/sha512"
)

func main(){
	router := fasthttprouter.New()

	router.GET("/api/version", func (ctx *fasthttp.RequestCtx){
		ctx.WriteString(version)
	})

	router.POST("/api/auth", func(ctx *fasthttp.RequestCtx) {
		mongo, db := createMongoSession()
		defer mongo.Close()

		shagen := sha512.New()
		preToken := ctx.FormValue("pre-token")
		em := fmt.Sprintf("%s", preToken)
		shagen.Write([]byte(em))
		token := fmt.Sprintf("%x", shagen.Sum(nil))

		sessionCollection := db.C("session")
		var sessionData map[string]interface{}
		sessionCollection.Find(
			map[string]string{
				"sessionId" : token,
			}).One(&sessionData)

		b, err := json.Marshal(map[string]interface{}{
			"token" : token,
			"cookie": sessionData["cookie"].(string),
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

	router.POST("/api/work", func(ctx *fasthttp.RequestCtx) {
		mongo, db := createMongoSession()
		defer mongo.Close()

		session := string(ctx.Request.Header.Cookie("SESSIONID"))
		startTime := string(ctx.FormValue("startTime"))
		endTime := string(ctx.FormValue("endTime"))
		c := db.C("work")
		err := c.Insert(map[string]string{
			"session": session,
			"startTime": startTime,
			"endTime": endTime,
		})

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

	router.GET("/", func (ctx *fasthttp.RequestCtx){
		ctx.SendFile("./../template/build/index.html")
	})

	router.ServeFiles("/static/*filepath", "./../template/build/static")

	router.NotFound = func(ctx *fasthttp.RequestCtx) {
		ctx.SendFile("./../template/build/index.html")
	}

	var session Middleware
	session.Next = router.Handler
	session.Function = func(m *Middleware, ctx *fasthttp.RequestCtx){
		sessionId := ctx.Request.Header.Cookie("SESSIONID")

		if string(sessionId) != "" {
			mongo, db := createMongoSession()
			c := db.C("session")

			cookie := make(map[string]string)

			ctx.Request.Header.VisitAllCookie(func(k, v []byte){
				cookie[string(k)] = string(v)
			})

			c.Upsert(
				map[string]interface{}{
					"sessionId": string(sessionId),
				},
				map[string]interface{}{
					"sessionId": string(sessionId),
					"cookie":    cookie,
				})
			mongo.Close()
		}

		m.Next(ctx)
	}

	log.Fatal(fasthttp.ListenAndServe(port, session.Handler))
}

