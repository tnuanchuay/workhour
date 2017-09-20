package main

import (
	"crypto/sha512"
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
)

func main() {
	router := fasthttprouter.New()

	router.GET("/api/average", API_AverageWorkHourPerWeek)

	router.GET("/api/version", func(ctx *fasthttp.RequestCtx) {
		ctx.WriteString(version)
	})

	router.POST("/api/auth", func(ctx *fasthttp.RequestCtx) {
		mongo, db := createMongoSession()
		defer mongo.Close()

		SHA := sha512.New()
		preToken := ctx.FormValue("pre-token")
		em := fmt.Sprintf("%s", preToken)
		SHA.Write([]byte(em))
		token := fmt.Sprintf("%x", SHA.Sum(nil))

		c := db.C("user")
		count, err := c.Find(map[string]string{"token": token}).Count()
		if err != nil {
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}

		if count == 0 {
			err = c.Insert(map[string]string{"token": token})
		}

		sessionCollection := db.C("session")
		var sessionData map[string]interface{}
		sessionCollection.Find(
			map[string]string{
				"sessionId": token,
			}).One(&sessionData)

		var b []byte
		if sessionData != nil {
			b, err = json.Marshal(map[string]interface{}{
				"token":  token,
				"cookie": sessionData["cookie"].(interface{}),
			})

			if err != nil {
				fmt.Println(err.Error())
				ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
				return
			}
		} else {
			b, err = json.Marshal(map[string]interface{}{
				"token": token,
			})
		}

		if err != nil {
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		} else {
			ctx.Write(b)
		}
	})

	router.POST("/api", func(ctx *fasthttp.RequestCtx) {
		res, err := json.Marshal(map[string]string{
			"status": "ok",
		})

		if err != nil {
			log.Fatal(err)
			return
		}

		ctx.Write(res)
	})

	router.POST("/api/work", func(ctx *fasthttp.RequestCtx) {
		mongo, db := createMongoSession()
		defer mongo.Close()

		session := string(ctx.Request.Header.Cookie("SESSIONID"))
		startTime := string(ctx.FormValue("startTime"))
		endTime := string(ctx.FormValue("endTime"))
		c := db.C("work")
		st, _ := strconv.Atoi(startTime)
		et, _ := strconv.Atoi(endTime)
		err := c.Insert(map[string]interface{}{
			"session":   session,
			"startTime": st,
			"endTime":   et,
		})

		if err != nil {
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}

		json, err := json.Marshal(map[string]interface{}{
			"status": "ok",
		})

		if err != nil {
			fmt.Println(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		} else {
			ctx.Write(json)
		}
	})

	router.GET("/", func(ctx *fasthttp.RequestCtx) {
		ctx.SendFile("./../template/build/index.html")
	})

	router.ServeFiles("/static/*filepath", "./../template/build/static")

	router.NotFound = func(ctx *fasthttp.RequestCtx) {
		path := string(ctx.Path())
		fullPathToRedirect := fmt.Sprintf("/#!%s", path)
		ctx.Redirect(fullPathToRedirect, 301)
	}

	var session Middleware
	session.Next = router.Handler
	session.Function = func(m *Middleware, ctx *fasthttp.RequestCtx) {
		sessionId := ctx.Request.Header.Cookie("SESSIONID")

		if string(sessionId) != "" {
			mongo, db := createMongoSession()
			c := db.C("session")

			cookie := make(map[string]string)

			ctx.Request.Header.VisitAllCookie(func(k, v []byte) {
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

	var cors Middleware
	cors.Next = router.Handler
	cors.Function = func(m *Middleware, ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Add("Access-Control-Allow-Origin", "http://localhost:3000")
		ctx.Response.Header.Add("Access-Control-Allow-Credentials", "true")
		fmt.Println(string(ctx.Path()))
		m.Next(ctx)
	}

	log.Fatal(fasthttp.ListenAndServe(port, cors.Handler))
}
