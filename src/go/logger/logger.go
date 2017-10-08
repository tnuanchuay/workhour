package logger

import (
	"io/ioutil"
	"log"
	"fmt"
	"time"
)

const pattern = "[%s][%s]:\t%s"

type Logger struct{
	Path string
}

func (Logger)Create(path string) Logger{
	logger := Logger{}
	logger.Path = path
	return logger
}

func (this Logger)Panic(lg string){
	level := "Panic"
	lg = createMessage(lg, level)
	this.write(lg)
	panic(lg)
}

func (this Logger)Fatal(lg string){
	level := "Fatal"
	lg = createMessage(lg, level)
	this.write(lg)
}

func (this Logger)Error(lg string){
	level := "Error"
	lg = createMessage(lg, level)
	this.write(lg)
}

func (this Logger)Debug(lg string){
	level := "Debug"
	lg = createMessage(lg, level)
	this.write(lg)
}

func (this Logger)Info(lg string){
	level := "Info"
	lg = createMessage(lg, level)
	this.write(lg)
}

func createMessage(lg string, level string) string {
	stime := time.Now().Format("2006-01-02 15:04:05.999999")
	lg = fmt.Sprintf(pattern, level, stime, lg)
	return lg
}

func (this Logger) write (lg string){
	err := ioutil.WriteFile(this.Path, []byte(lg), 0644)
	if err != nil {
		log.Fatal(err)
	}
}
