package controller

import (
	"github.com/valyala/fasthttp"
	"io/ioutil"
)

const VERSION_FILE = "version.txt"

type HealthHandler struct {
	
}

func Version(ctx *fasthttp.RequestCtx) {
	version, _ := ioutil.ReadFile(VERSION_FILE)
	ctx.Write(version)
}
