import React, { Component } from 'react'
import 'whatwg-fetch'
import moment from 'moment'

const dateFormat = "YYYY MMMM Do YYYY"
const timeFormat = "h:mm:ss a"

class Home extends Component {

    constructor(props) {
        super(props)
        this.cookies = props.cookies
        this.state = { isRunning: false, runingInterval: undefined }
    }

    run() {
        let state = {}
        if (!this.state.isRunning) {
            state.startTime = new Date()
            state.runingInterval = setInterval(() => {
                this.setState({})
            }, 1000)
        } else {
            let data = new FormData()
            data.append("startTime", moment(this.state.startTime).toString())
            data.append("endTime", moment(new Date()).toString())
            fetch("api/work",{
                method:"POST",
                body:data,
                credentials: 'include'
            }).then(() => {
                clearInterval(this.state.runingInterval)
                state.runingInterval = null
            }).catch((err) => {
                console.log(err)
                alert(err)
            })
        }

        state.isRunning = !this.state.isRunning

        this.setState(state)
    }

    render() {

        // format a string result
        var s = moment.utc(moment(moment(), "DD/MM/YYYY HH:mm:ss").diff(moment(this.state.startTime ? this.state.startTime : moment(), "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
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