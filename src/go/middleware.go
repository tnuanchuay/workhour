package main

import "github.com/valyala/fasthttp"

type Middleware struct {
	Next fasthttp.RequestHandler
	Function func(m *Middleware, ctx *fasthttp.RequestCtx)
}

func (m *Middleware) Handler(ctx *fasthttp.RequestCtx){
	m.Function(m, ctx)
}