import React, { Component } from 'react'
import 'whatwg-fetch'
import { Bar } from 'react-chartjs-2'

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
        this.state = { isRunning: startTime ? true : false, data: [0, 0, 0, 0, 0, 0, 0] }
        if (this.state.isRunning) {
            this.setState({ startTime: new Date(parseInt(startTime, 10)) })
            this.setState({
                runingInterval: setInterval(() => {
                    this.setState({})
                }, 1000)
            })
        }
    }

    componentDidMount() {
        fetch("api/average", {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => {
                var data = json.data
                var finalResult =
                    [
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                        { data: 0, count: 0 },
                    ]
                data.forEach((value) => {
                    let StartDate = new Date(value.StartTime)
                    finalResult[StartDate.getDay()].data += (value.EndTime - value.StartTime)
                    finalResult[StartDate.getDay()].count++
                })

                finalResult = finalResult.map((value => Math.round(value.data / 3600000 / value.count * 100) / 100))
                console.log(finalResult)
                this.setState({ data: finalResult })
            })
            .catch((err) => alert(err))
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
        // format a string result
        let now = new Date();
        let diff = this.state.startTime === undefined ? 0 : Math.floor((now - new Date(this.state.startTime)) / 1000)
        let sec = this.state.startTime === undefined ? 0 : Math.floor(diff % 60)
        let min = this.state.startTime === undefined ? 0 : Math.floor((diff / 60) % 60)
        let hour = this.state.startTime === undefined ? 0 : Math.floor(diff / 3600)
        let s = `
        ${(hour).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(min).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:${(sec).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}`

        dataTemplate.datasets[0].data = this.state.data

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

                    <div className="col chart-container my-5">
                        <Bar data={dataTemplate} />
                    </div>
                </div>
            </div >
        )
    }
}

export default Home