package main

import (
	"github.com/tspn/workhour/src/go/repository"
	"github.com/tspn/workhour/src/go/controller"
)

type AppRepository struct {
	Session repository.SessionRepository
	Work    repository.WorkRepository
	User    repository.UserRepository
}

type AppController struct{
	*controller.AuthController
	*controller.SAPIController
	*controller.WorkController
}