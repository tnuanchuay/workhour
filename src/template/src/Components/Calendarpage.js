import React, { Component } from 'react'
import Calendar from './Calendar'
class CalendarPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container my-5">
                <Calendar />
            </div>
        )
    }
}

export default CalendarPage