package db

import (
	"testing"
	"io/ioutil"
)

func setup(t *testing.T) Config{
	jConfig, err := ioutil.ReadFile("./TestData/TestDatabase_CreateMongoSession.json")
	if err != nil {
		t.Error("Cannot read example configuration")
	}
	config := Config{}.Create(string(jConfig))
	return config
}

func TestDatabase_CreateMongoSession(t *testing.T) {
	config := setup(t)
	db := Database{}.Create(config)

	if db.Mongo == nil {
		t.Error("Cannot create Mongo session")
	}

	if db.DB == nil{
		t.Error("Cannot create Database session")
	}
}
