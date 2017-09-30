package controller

import (
	"github.com/tspn/workhour/src/go/repository"
	"github.com/valyala/fasthttp"
	"strconv"
	"fmt"
	"encoding/json"
)

type WorkController struct{
	BaseController
	WorkRepository		repository.WorkRepository
}

func (WorkController) Create(workRepository repository.WorkRepository) *WorkController{
	return &WorkController{
		WorkRepository:workRepository,
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
}
