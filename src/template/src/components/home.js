import React, { Component } from 'react'
import 'whatwg-fetch'
import { Bar } from 'react-chartjs-2'
import time from './../utils/time.js'

const daylist = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thuesday", "Friday", "Saturday"]

let dataTemplate = {
    labels: daylist,
    responsive: true,
    datasets: [{
        label: 'Hours',
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 3
    }]
}

class Home extends Component {

    constructor(props) {
        super(props)
        this.cookies = props.cookies
        let startTime = this.cookies.get("start")
        this.state = { isRunning: startTime ? true : false, data: [0, 0, 0, 0, 0, 0, 0], session: props.session }
        if (this.state.isRunning) {
            this.state.startTime = new Date(parseInt(startTime, 10))
            this.state.runingInterval = setInterval(() => {
                this.setState({})
            }, 1000)
        }
    }

    componentDidMount() {
        if (this.state.session === undefined)
            return

        fetch("api/average", {
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
        // format a string result
        let now = new Date();
        let diff = this.state.startTime === undefined ? 0 : Math.floor((now - new Date(this.state.startTime)) / 1000)
        let sec = this.state.startTime === undefined ? 0 : Math.floor(diff % 60)
        let min = this.state.startTime === undefined ? 0 : Math.floor((diff / 60) % 60)
        let hour = this.state.startTime === undefined ? 0 : Math.floor(diff / 3600)
        let s = `
        ${(hour).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(min).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(sec).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`

        dataTemplate.datasets[0].data = this.state.graph

        return (
            <div className="container ">
                <div className="row justify-content-md-center">
                        <div className="col my-5">
                            <div className="text-center h1">
                                You are working for
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

                    <div className="col my-5">
                        <div className="text-center h3">
                            This day in this month
                        </div>
                        <div className="text-center clock">
                            {this.state.thisDayWork ? this.state.thisDayWork : 0} hr
                        </div>
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <div className="col my-5">
                        <div className="text-center h3">
                            Work hour for this Week
                        </div>
                        <div className="text-center clock">
                            {this.state.hourPerWeek ? this.state.hourPerWeek : 0} hr
                        </div>
                    </div>
                    <div className="col my-5">
                        <div className="text-center h3">
                            Work hour for this Month
                        </div>
                        <div className="text-center clock">
                            {this.state.hourPerMonth ? this.state.hourPerMonth : 0} hr
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Home