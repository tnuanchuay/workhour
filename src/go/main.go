package main

import (
	"encoding/json"
	"io/ioutil"
	"github.com/tspn/workhour/src/go/db"
	"github.com/tspn/workhour/src/go/repository"
	"github.com/tspn/workhour/src/go/controller"
	"github.com/buaazp/fasthttprouter"
	"github.com/valyala/fasthttp"
	"fmt"
	"log"
)

const CONFIGFILE = "./config.json"

func main() {
	config := loadConfig(CONFIGFILE)
	dbConfig := config.DBConfig

	database := db.Database{}.Create(dbConfig)
	defer database.Mongo.Close()

	appRepository := createRepository(database)
	appController := create_controller(appRepository)

	router := fasthttprouter.New()
	create_route(router, appController)

	session := session(router, appRepository)
	cors := cors(session)

	log.Println(fmt.Sprintf("Server Start @%d", config.Port))
	log.Println(fasthttp.ListenAndServe(fmt.Sprintf(":%d", config.Port), cors.Handler))
}

func session(router *fasthttprouter.Router, appRepository AppRepository) Middleware{
	var session Middleware
	session.Next = router.Handler
	session.Function = func(m *Middleware, ctx *fasthttp.RequestCtx) {
		sessionId := ctx.Request.Header.Cookie("SESSIONID")

		if string(sessionId) != "" {
			c := appRepository.Session.Collection

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
		}

		m.Next(ctx)
	}

	return session
}

func create_controller(appRepository AppRepository) (AppController) {
	authController := controller.AuthController{}.Create(appRepository.User, appRepository.Session)
	sapiController := controller.SAPIController{}.Create(appRepository.Work)
	workController := controller.WorkController{}.Create(appRepository.Work)
	return AppController{authController, sapiController, workController}
}

func create_route(router *fasthttprouter.Router, appController AppController) {
	router.GET("/", func(ctx *fasthttp.RequestCtx) {
		ctx.SendFile("./../template/build/index.html")
	})

	router.POST("/api/auth", appController.AuthController.Auth)
	router.GET("/api/average", appController.SAPIController.API_AverageWorkHourPerWeek)
	router.POST("/api/work", appController.WorkController.WorkDone)
	router.NotFound = func(ctx *fasthttp.RequestCtx) {
		path := string(ctx.Path())
		fullPathToRedirect := fmt.Sprintf("/#!%s", path)
		ctx.Redirect(fullPathToRedirect, 301)
	}
	
	router.ServeFiles("/static/*filepath", "./../template/build/static")
	router.NotFound = func(ctx *fasthttp.RequestCtx) {
		path := string(ctx.Path())
		fullPathToRedirect := fmt.Sprintf("/#!%s", path)
		ctx.Redirect(fullPathToRedirect, 301)
	}
}

func cors(md Middleware) Middleware {
	var cors Middleware
	cors.Next = md.Handler
	cors.Function = func(m *Middleware, ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Add("Access-Control-Allow-Origin", "http://localhost:3000")
		ctx.Response.Header.Add("Access-Control-Allow-Credentials", "true")
		fmt.Println(string(ctx.Path()))
		m.Next(ctx)
	}
	return cors
}

func createRepository(database db.Database) AppRepository {
	sessionRepository := repository.SessionRepository{}.Create(database)
	workRepository := repository.WorkRepository{}.Create(database)
	userRepository := repository.UserRepository{}.Create(database)
	return AppRepository{
		Session: sessionRepository,
		Work:    workRepository,
		User:    userRepository,
		}
}

func loadConfig(filename string) AppConfig{
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		panic("Cannot read config file")
	}
	config := AppConfig{}
	err = json.Unmarshal(b, &config)
	if err != nil{
		panic("Cannot parse json file to config")
	}

	return config
}
