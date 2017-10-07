import React, { Component } from 'react'

class Calendar extends Component {
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
        let now = new Date();
        let firstday = new Date(now.getFullYear(), now.getMonth())
        let elementOfDay = []
        for (let i = 0; i < this.getDayOfMonth(now); i++)
            elementOfDay.push(<td key={i}>{i + 1}</td>)

        //build first week
        var needmore = firstday.getDay()
        for (let i = 0; i < needmore; i++) {
            elementOfDay.unshift(<td key={0-(i+1)}>{this.getDayOfMonth()}</td>)
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

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="row container-fluid">
                        <h1>
                            October
                        </h1>
                        <div className="pull-right">
                            October
                        </div>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <td><h5>Sun</h5></td>
                                <td><h5>Mon</h5></td>
                                <td><h5>Tue</h5></td>
                                <td><h5>Wed</h5></td>
                                <td><h5>Thu</h5></td>
                                <td><h5>Fri</h5></td>
                                <td><h5>Sat</h5></td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.getTableBody()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Calendar