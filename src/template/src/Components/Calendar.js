import React, { Component } from 'react'

class Calendar extends Component {

    constructor(props) {
        super(props)
        this.state = { date: new Date(), data: props.data }
    }

    leapYear(year) {
        return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ? 29 : 28;
    }

    getDayOfMonth(now) {
        let month = now.getMonth() + 1;
        if (month === 1)
            month = 12
        let leapYear = this.leapYear
        let day = [1, 5, 7, 8, 10, 12].indexOf(month) >= 0 ? 31 :
            month === 2 ? leapYear(now.getFullYear()) : 30

        return day
    }

    getTableBody() {
        let now = this.state.date
        let firstday = new Date(now.getFullYear(), now.getMonth())
        let elementOfDay = []
        for (let i = 0; i < this.getDayOfMonth(now); i++) {
            let hour = 0
            if (this.state.data) {
                for (let j = 0; j < this.state.data.length; j++) {
                    if (new Date(this.state.data[j].StartTime).getDate() === (i + 1)) {
                        hour = Math.round((new Date(this.state.data[j].EndTime) - new Date(this.state.data[j].StartTime)) / 3600000 * 100) / 100
                    }
                }
            }
            elementOfDay.push(<DateBlock key={i} date={i + 1} hour={hour} />)
        }

        //build first week
        var needmore = firstday.getDay()
        for (let i = 0; i < needmore; i++) {
            elementOfDay.unshift(<DateBlock key={0 - (i + 1)} date={this.getDayOfMonth(new Date(now.getFullYear(), now.getMonth() - 1)) - i} />)
        }

        let weekSeparation = []
        for (let i = 0; i < elementOfDay.length; i++) {
            if (!weekSeparation[parseInt(i / 7)])
                weekSeparation[parseInt(i / 7)] = []
            weekSeparation[parseInt(i / 7)].push(elementOfDay[i])
        }

        let elementOfWeek = []
        for (let i = 0; i < weekSeparation.length; i++) {
            elementOfWeek.push(<tr key={i}>{weekSeparation[i]}</tr>)
        }

        return elementOfWeek
    }

    getMonthName() {
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        return monthNames[this.state.date.getMonth()]
    }

    render() {
        return (
            <div>
                <div className="text-right">
                    <div className="pull-right">
                        <h1>{this.getMonthName()}</h1>
                    </div>
                </div>
                <div className="row">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <td><div className="h5">Sun</div></td>
                                <td><div className="h5">Mon</div></td>
                                <td><div className="h5">Tue</div></td>
                                <td><div className="h5">Wed</div></td>
                                <td><div className="h5">Thu</div></td>
                                <td><div className="h5">Fri</div></td>
                                <td><div className="h5">Sat</div></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getTableBody()}
                        </tbody>
                    </table>
                </div>
                <div className="row justify-content-md-center">
                    {/* <div className="text-center">
                        <button className="btn btn-default" type="button">
                            Previous
                        </button>
                        <button className="btn btn-default" type="button">
                            Next
                        </button>
                    </div> */}
                </div>
            </div>
        )
    }
}

class DateBlock extends Component {
    constructor(props) {
        super(props)
        let data = props.hour
        if (props.data)
            data = undefined
        this.state = { date: props.date, data: data }
    }
    render() {
        return (
            <td className="red">
                <div className="h5">
                    {!this.state.data ? "-" : this.state.data}
                </div>
                <div className={"calendar-date-text text-right"}>
                    <span className="text-circle">{this.state.date}</span >
                </div>
            </td>
        )
    }
}

export default Calendar