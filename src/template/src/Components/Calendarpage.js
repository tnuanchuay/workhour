import React, { Component } from 'react'
import Calendar from './Calendar'
import config from '../config/appConfig'
import ReactLoading from 'react-loading'
import 'whatwg-fetch'

class CalendarPage extends Component {

    componentDidMount() {
        fetch(`${config.api}/api/work?type=month&month=${new Date().getMonth()+1}`, {
            method: "GET",
            credentials: "include"
        })
            .then((response) => response.json())
            .then((json) => {
                this.setState({ data: json.data })
            })
            .catch((err) => alert(err))
    }

    render() {
        let calendar = null;
        if (this.state) {
            if (this.state.data)
                calendar = <Calendar data={this.state.data} />
        }

        if(calendar){
            return (
                <div className="container my-5">
                    {calendar}
                </div>
            )
        }else{
            return (
                <div className="loadder">
                    <ReactLoading type="spinningBubbles" color="#444" />
                </div>
            )
        }
    }
}

export default CalendarPage