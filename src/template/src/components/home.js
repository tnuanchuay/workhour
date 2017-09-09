import React, { Component } from 'react'
import 'whatwg-fetch'
import moment from 'moment'

const dateFormat = "YYYY MMMM Do YYYY"
const timeFormat = "h:mm:ss a"

class Home extends Component {

    constructor(props) {
        super(props)
        this.cookies = props.cookies

        let startTime = this.cookies.get("start")
        this.state = { isRunning: startTime ? true : false,  }
        if (this.state.isRunning) {
            this.state.startTime = new Date(parseInt(startTime))
            this.state.runingInterval = setInterval(() => {
                this.setState({})
            }, 1000)
        }
    }

    run() {
        let state = {}
        if (!this.state.isRunning) {
            state.startTime = new Date()
            this.cookies.set("start", state.startTime.getTime())
            fetch("api", {
                method: "POST",
                credentials: "include"
            })

            state.runingInterval = setInterval(() => {
                this.setState({})
            }, 1000)
        } else {
            let data = new FormData()
            data.append("startTime", this.state.startTime.getTime())
            data.append("endTime", new Date().getTime())
            fetch("api/work", {
                method: "POST",
                body: data,
                credentials: 'include'
            }).then(() => {
                clearInterval(this.state.runingInterval)
                state.runingInterval = null
            }).catch((err) => {
                console.log(err)
                alert(err)
            })
            this.cookies.remove("start")
        }

        state.isRunning = !this.state.isRunning

        this.setState(state)
    }

    render() {
        console.log(this.state.startTime)
        // format a string result
        let now = new Date();
        let diff = this.state.startTime == undefined ? 0 : Math.floor((now - new Date(this.state.startTime)) / 1000)
        let sec = this.state.startTime == undefined ? 0 : Math.floor(diff % 60)
        let min = this.state.startTime == undefined ? 0 : Math.floor((diff / 60)%60)
        let hour = this.state.startTime == undefined ? 0 : Math.floor(diff / 3600)
        let s = `
        ${(hour).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${(min).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}:${(sec).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}`
        return (
            <div className="container ">
                <div className="row justify-content-md-center">
                    <div className="col">
                        <div className="row text-center">
                            <h2>
                                You are working for
                            </h2>
                        </div>

                        <div className="row">
                            <h1>
                                {s}
                            </h1>
                        </div>

                        <div className="row">
                            <button onClick={this.run.bind(this)} className={"btn btn-lg " + (this.state.isRunning ? "btn-success" : "btn-info")}>
                                {this.state.isRunning ? "I'm going home" : "I'm at the office"}
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

class Clock extends Component {
    constructor(props) {
        super(props)
        this.state = { time: moment() }
        this.Start()
    }

    Start() {
        setInterval(() => {
            this.setState({ time: moment() })
        }, 1000)
    }

    render() {
        return (<h1>
            <div className="row">
                {this.state.time.format(dateFormat)}
            </div>
            <div className="row">
                {this.state.time.format(timeFormat)}
            </div>
        </h1>)
    }
}

export default Home