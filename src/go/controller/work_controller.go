package controller

import (
	"github.com/tspn/workhour/src/go/repository"
	"github.com/valyala/fasthttp"
	"strconv"
	"encoding/json"
	"time"
)

type WorkController struct{
	BaseController
	WorkRepository		repository.WorkRepository
}

func (WorkController) Create(workRepository repository.WorkRepository, logPath string) *WorkController{
	instance := &WorkController{
		WorkRepository:workRepository,
	}
	instance.Logger.Path = logPath
	return instance
}

func (this *WorkController)month(ctx *fasthttp.RequestCtx){
	session := string(ctx.Request.Header.Cookie("SESSIONID"))
	sMonth := string(ctx.QueryArgs().Peek("month"))
	if sMonth == ""{
		errString := "cannot query month with month parameter"
		this.Logger.Error(errString)
		ctx.Error(errString, fasthttp.StatusNotFound)
		return
	}

	month, err := strconv.Atoi(sMonth)
	if err != nil {
		errString := "cannot parse month parameter"
		this.Logger.Error(errString)
		ctx.Error(errString, fasthttp.StatusNotFound)
		return
	}

	works := this.WorkRepository.GetWorkByMonthYear(session, month, time.Now().Year())
	response, err := json.Marshal(map[string]interface{}{
		"data":works,
	})

	if err != nil {
		errString := "cannot parse work model"
		this.Logger.Error(errString)
		ctx.Error(errString, fasthttp.StatusNotFound)
		return
	}

	ctx.Write(response)
}

func (this *WorkController) GetWorkData(ctx *fasthttp.RequestCtx){
	session := string(ctx.Request.Header.Cookie("SESSIONID"))
	if session == ""{
		errString := "session not found"
		this.Logger.Error(errString)
		ctx.Error(errString, fasthttp.StatusNotFound)
		return
	}

	query := string(ctx.QueryArgs().Peek("type"))
	if query == ""{
		errString := "cannot query without type"
		this.Logger.Error(errString)
		ctx.Error(errString, fasthttp.StatusNotFound)
	}

	switch(query){
	case "month":
		this.month(ctx)
	}
}

func (this *WorkController) WorkDone(ctx *fasthttp.RequestCtx) {
	session := string(ctx.Request.Header.Cookie("SESSIONID"))
	startTime := string(ctx.FormValue("startTime"))
	endTime := string(ctx.FormValue("endTime"))
	c := this.WorkRepository.Collection
	st, _ := strconv.Atoi(startTime)
	et, _ := strconv.Atoi(endTime)
	err := c.Insert(map[string]interface{}{
		"session":   session,
		"startTime": st,
		"endTime":   et,
	})

	if err != nil {
		this.Logger.Error(err.Error())
		ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		return
	}

	json, err := json.Marshal(map[string]interface{}{
		"status": "ok",
	})

	if err != nil {
		this.Logger.Error(err.Error())
		ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
	} else {
		ctx.Write(json)
	}
}
