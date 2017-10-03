package controller

import (
	"github.com/valyala/fasthttp"
	"github.com/tspn/workhour/src/go/repository"
	"encoding/json"
	"log"
	"github.com/tspn/workhour/src/go/model"
)

type SAPIController struct{
	BaseController
	WorkRepository	repository.WorkRepository
}

func (SAPIController)Create(workRepository repository.WorkRepository)*SAPIController{
	return &SAPIController{WorkRepository:workRepository}
}

func (this SAPIController) API_AverageWorkHourPerWeek(ctx *fasthttp.RequestCtx){
	sessionId := ctx.Request.Header.Cookie("SESSIONID")
	works := make([]model.Work, 0)

	session  := this.WorkRepository.Database.DB.C("work")

	err := session.Find(map[string]string{
		"session":string(sessionId),
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
