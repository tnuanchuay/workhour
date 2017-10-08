package controller

import (
	"github.com/tspn/workhour/src/go/repository"
	"github.com/valyala/fasthttp"
	"fmt"
	"encoding/json"
	"crypto/sha512"
)

type AuthController struct{
	BaseController
	UserRepository		repository.UserRepository
	SessionRepository	repository.SessionRepository
}

func (AuthController) Create(userRepository repository.UserRepository, sessionRepository repository.SessionRepository, logPath string) *AuthController{
	instance :=  &AuthController{
		UserRepository:userRepository,
		SessionRepository:sessionRepository,
	}
	instance.Logger.Path = logPath
	return instance
}

func (this *AuthController) Auth(ctx *fasthttp.RequestCtx){
	token := getSHA(ctx)
	cc := this.UserRepository.Collection
	count, err := cc.Find(map[string]string{"token": token}).Count()
	if err != nil {
		this.Logger.Error(err.Error())
		ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
		return
	}

	if count == 0 {
		err = cc.Insert(map[string]string{"token": token})
	}

	sc := this.SessionRepository.Collection
	var sessionData map[string]interface{}
	sc.Find(
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
			this.Logger.Error(err.Error())
			ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
			return
		}
	} else {
		b, err = json.Marshal(map[string]interface{}{
			"token": token,
		})
	}

	if err != nil {
		this.Logger.Error(err.Error())
		ctx.Error(err.Error(), fasthttp.StatusServiceUnavailable)
	} else {
		ctx.Write(b)
	}
}

func getSHA(ctx *fasthttp.RequestCtx) string {
	SHA := sha512.New()
	preToken := ctx.FormValue("pre-token")
	em := fmt.Sprintf("%s", preToken)
	SHA.Write([]byte(em))
	token := fmt.Sprintf("%x", SHA.Sum(nil))
	return token
}