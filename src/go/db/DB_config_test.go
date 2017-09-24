package db

import (
	"testing"
	"io/ioutil"
	"time"
)

func TestConfig_Create(t *testing.T) {
	testConfig, err := ioutil.ReadFile("./TestData/config.json")
	if err != nil {
		t.Error("Error should not be null, cannot read test data config.json")
	}
	config := Config{}.Create(string(testConfig))

	if config.Port != 1234 {
		t.Error("Port should be 1234")
	}

	if len(config.Addr) != 2{
		t.Error("Addr length is incorrect")
	}

	if config.Addr[0] != "222.222.222.222"{
		t.Error("First Addr is incorrect")
	}

	if config.Addr[1] != "111.111.111.111"{
		t.Error("Second Addr is incorrect")
	}

	if config.Database != "database"{
		t.Error("Database is incorrect")
	}
	t.Log(config.Timeout)
	if config.Timeout != (time.Second * 60){
		t.Error("timeout is incorrect")
	}

	if config.Username != "username"{
		t.Error("username is incorrect")
	}

	if config.Password != "password"{
		t.Error("password is incorrect")
	}
}
