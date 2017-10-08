import React, { Component } from 'react'
import 'whatwg-fetch'
import config from '../config/appConfig'
import time from './../utils/time.js'
import ReactLoading from 'react-loading'

class Home extends Component {

    constructor(props) {
        super(props)
        this.cookies = props.cookies
        let startTime = this.cookies.get("start")
        this.state = { isRunning: startTime ? true : false, data: [0, 0, 0, 0, 0, 0, 0], session: props.session }
        if (this.state.isRunning) {
                this.state.startTime =  new Date(parseInt(startTime, 10))
                this.state.runingInterval =  setInterval(() => {
                    this.setState({})
                }, 1000)
        }
    }

    componentDidMount() {
        if (this.state.session === undefined)
            return

        fetch(config.api + "/api/average", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => {
                let today = new Date()
                let data = json.data
                if (data === null)
                    data = []

                let workPerDate = []

                data.forEach(value => {
                    let startDate = new Date(value.StartTime)
                    workPerDate[startDate.getDate()] = { diff: 0 }
                    workPerDate[startDate.getDate()].diff += (value.EndTime - value.StartTime)
                    workPerDate[startDate.getDate()].date = startDate
                })

                let workPerWeek = [0, 0, 0, 0, 0, 0, 0]
                let countPerWeek = [0, 0, 0, 0, 0, 0, 0]

                workPerDate.forEach(value => {
                    workPerWeek[value.date.getDay()] += value.diff
                    countPerWeek[value.date.getDay()]++
                })

                workPerWeek = workPerWeek.map((value, index) => {
                    return value / countPerWeek[index]
                })

                workPerWeek = workPerWeek.map(value => Math.round(value / 3600000 * 100) / 100)
                let firstDateOfWeek = time.getFirstDateOfTheWeek()
                let hourPerMonth = Math.round(workPerDate.reduce((sum, value) => sum + value.diff, 0) / 3600000 * 100) / 100
                let hourPerWeek = Math.round(workPerDate.reduce((sum, value) => {
                    if (firstDateOfWeek <= value.date)
                        return sum + value.diff
                    else
                        return sum
                }, 0) / 3600000 * 100) / 100

                let thisDayWork = workPerDate.filter((value, index) => {
                    if (value.date.getDay() === today.getDay())
                        return value
                    return undefined
                }).reduce((sum, value, index, array) => {
                    return sum += Math.round(value.diff / 3600000 * 100) / 100 / array.length
                }, 0)

                this.setState({ graph: workPerWeek, hourPerMonth: hourPerMonth, hourPerWeek: hourPerWeek, thisDayWork: thisDayWork })
            })
            .catch((err) => alert(err))
    }

    run() {
        if (this.state.session === undefined)
            return <div />

        let state = {}
        if (!this.state.isRunning) {
            state.startTime = new Date()
            this.cookies.set("start", state.startTime.getTime())
            fetch(`${config.api}/api`, {
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
            fetch(`${config.api}/api/work`, {
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
        // format a string result
        let now = new Date();
        let diff = this.state.startTime === undefined ? 0 : Math.floor((now - new Date(this.state.startTime)) / 1000)
        let sec = this.state.startTime === undefined ? 0 : Math.floor(diff % 60)
        let min = this.state.startTime === undefined ? 0 : Math.floor((diff / 60) % 60)
        let hour = this.state.startTime === undefined ? 0 : Math.floor(diff / 3600)
        let s = `
        ${(hour).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(min).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(sec).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`

        return (
            <div className="container mt-5">

                <div className="row justify-content-md-center">
                        <div className="col-lg-6 col-sm-12 home-panel">
                            <div className="text-center h1">
                                Work Hours
                            </div>
                            <div className="text-center clock">
                                {s}
                            </div>
                            <div className="text-center">
                                <button onClick={this.run.bind(this)} className={"btn btn-lg " + (this.state.isRunning ? "btn-success" : "btn-info")}>
                                    {this.state.isRunning ? "I'm going home" : "I'm at the office"}
                                </button>
                            </div>
                        </div>

                    <div className="col-lg-6 col-sm-12 home-panel">
                        <div className="text-center h3">
                            This day in this month
                        </div>
                        <div className="d-flex justify-content-center pt-5 clock">
                            {this.state.thisDayWork !== undefined ? `${this.state.thisDayWork} hr.` : <ReactLoading className="" type="spinningBubbles" color="#444" />}
                        </div>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div className="col-lg-6 col-sm-12 home-panel">
                        <div className="text-center h3">
                            Work hour for this Week
                        </div>
                        <div className="d-flex justify-content-center pt-5 clock">
                            {this.state.hourPerWeek !== undefined ? `${this.state.hourPerWeek} hr.` : <ReactLoading className="" type="spinningBubbles" color="#444" />}
                        </div>
                    </div>
                    <div className="col-lg-6 col-sm-12 home-panel">
                        <div className="text-center h3">
                            Work hour for this Month
                        </div>
                        <div className="d-flex justify-content-center pt-5 clock">
                            {this.state.hourPerMonth !== undefined ? `${this.state.hourPerMonth} hr.` : <ReactLoading className="" type="spinningBubbles" color="#444" />}
                        </div>
                    </div>
                </div>
                
            </div >
        )
    }
}
export default Home