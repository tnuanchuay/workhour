import React, { Component } from 'react'

class Calendar extends Component {

    constructor(props) {
        super(props)
        this.state = { date: new Date() }
    }

    leapYear(year) {
        return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? 29 : 28;
    }

    getDayOfMonth(now) {
        let month = now.getMonth() + 1;
        if (month === 1)
            month = 12
        let leapYear = this.leapYear
        let day = [1, 5, 7, 8, 10, 12].indexOf(month) >= 0 ? 31 :
            month == 2 ? leapYear(now.getFullYear()) : 30

        return day
    }

    getTableBody() {
        let now = this.state.date
        let firstday = new Date(now.getFullYear(), now.getMonth())
        let elementOfDay = []
        for (let i = 0; i < this.getDayOfMonth(now); i++)
            elementOfDay.push(<td key={i}>{i + 1}</td>)

        //build first week
        var needmore = firstday.getDay()
        for (let i = 0; i < needmore; i++) {
            elementOfDay.unshift(<td key={0 - (i + 1)} className="">{this.getDayOfMonth(new Date(now.getFullYear(), now.getMonth()-1))-i}</td>)
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

        console.log(elementOfWeek)

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
                    <table className="table">
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
                    <div className="text-center">
                        <button className="btn btn-default" type="button">
                            <i className="glyphicon glyphicon-align-left"></i>
                        </button>
                        <button className="btn btn-default" type="button">
                            <i className="glyphicon glyphicon-align-left"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Calendar