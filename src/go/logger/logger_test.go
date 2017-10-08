package logger

import (
	"testing"
	"os"
	"io/ioutil"
	"regexp"
)

const filename = "./test.txt"

func setup()Logger{
	return Logger{}.Create(filename)
}

func teardown(){
	os.Remove(filename)
}

func TestLogger_Panic(t *testing.T) {
	defer func() {
		teardown()
		if r := recover(); r == nil {
			t.Errorf("The code did not panic")
		}
	}()

	logger := setup()
	logger.Panic("Test Panic")
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		t.Error("Error should be null")
	}
	r, err := regexp.Compile(`\[Panic]\[[\w: -\]]*\tTest Panic`)
	if err != nil{
		t.Error("regexp should not create new error")
	}

	match := r.Match(b)
	if !match {
		t.Error("output from file incorrect ")
	}
}

func TestLogger_Fatal(t *testing.T) {
	logger := setup()
	logger.Fatal("Test Fatal")
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		t.Error("Error should be null")
	}
	r, err := regexp.Compile(`\[Fatal]\[[\w: -\]]*\tTest Fatal`)
	if err != nil{
		t.Error("regexp should not create new error")
	}

	match := r.Match(b)
	if !match{
		t.Error("output from file incorrect ")
	}

	teardown()
}

func TestLogger_Error(t *testing.T) {
	logger := setup()
	logger.Error("Test Error")
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		t.Error("Error should be null")
	}
	r, err := regexp.Compile(`\[Error]\[[\w: -\]]*\tTest Error`)
	if err != nil{
		t.Error("regexp should not create new error")
	}

	match := r.Match(b)
	if !match{
		t.Error("output from file incorrect ")
	}

	teardown()
}

func TestLogger_Debug(t *testing.T) {
	logger := setup()
	logger.Debug("Test Debug")
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		t.Error("Error should be null")
	}
	r, err := regexp.Compile(`\[Debug]\[[\w: -\]]*\tTest Debug`)
	if err != nil{
		t.Error("regexp should not create new error")
	}

	match := r.Match(b)
	if !match{
		t.Error("output from file incorrect ")
	}

	teardown()
}

func TestLogger_Info(t *testing.T) {
	logger := setup()
	logger.Info("Test Info")
	b, err := ioutil.ReadFile(filename)
	if err != nil{
		t.Error("Error should be null")
	}
	r, err := regexp.Compile(`\[Info]\[[\w: -\]]*\tTest Info`)
	if err != nil{
		t.Error("regexp should not create new error")
	}

	match := r.Match(b)
	if !match{
		t.Error("output from file incorrect ")
	}

	teardown()
}

func TestLogger_Create(t *testing.T) {
	logger := Logger{}.Create(filename)

	if logger.Path != filename{
		t.Error("Log file Path should be ./test.txt")
	}

	teardown()
}