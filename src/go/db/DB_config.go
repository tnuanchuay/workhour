package db

import (
	"time"
	"encoding/json"
	"log"
)

type Config struct{
	Port		int
	Addr		[]string
	Database	string
	Timeout		time.Duration
	Username	string
	Password	string
}

func (Config) Create(j string) Config{
	config := Config{}
	err := json.Unmarshal([]byte(j), &config)
	if err != nil{
		log.Println(err)
	}
	return config
}