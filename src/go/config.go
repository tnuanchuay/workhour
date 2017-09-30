package main

import (
        "github.com/tspn/workhour/src/go/db"
)

type AppConfig struct {
        Port            int
        DBConfig        db.Config
}
