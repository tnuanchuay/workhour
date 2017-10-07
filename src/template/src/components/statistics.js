import React, { Component } from 'react'
import 'whatwg-fetch'
import config from '../config/appConfig'
import BarGraph from './barGraph'
import DoughnutGraph from './doughnutGraph'

// sample data
let jsonData = {
  data: [
    {
      "_id" : "59d08f4131ad137215815fd4",
      "endTime" : 1507285800000,
      "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
      "startTime" : 1507251900000
    },
    {
        "_id" : "59d22b8e31ad13721581bab0",
        "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
        "startTime" : 1507338000000,
        "endTime" : 1507370400000
    },
    {
      "_id" : "59d22b8e31ad13721581bab0",
      "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
      "startTime" : 1507165500000,
      "endTime" : 1507338000000
    },
    {
      "_id" : "59d22b8e31ad13721581bab0",
      "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
      "startTime" : 1507079100000,
      "endTime" : 1507338000000
    },
    {
      "_id" : "59d22b8e31ad13721581bab0",
      "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
      "startTime" : 1506992940000,
      "endTime" : 1507338000000
    }
  ]
}

let graph = {
  labels: [],
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
      borderWidth: 1,
      data: []
  }]
}

let labels = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  months:[]
}

export default class Statistic extends React.Component {
  constructor(props) {
    super(props)
    const { cookies, session } = props

    this.state = {
      data: [],
      session: session
    }
  }

  processData(response) {
    const processedData = {
      avgStartTimePerWeek: graph
    }

    const calculated = this.calAvgStartTimePerWeek(response)
    processedData.avgStartTimePerWeek.datasets[0].data = calculated.data
    processedData.avgStartTimePerWeek.average = calculated.average
    processedData.avgStartTimePerWeek.datasets[0].label = 'Time'
    processedData.avgStartTimePerWeek.labels = labels.days
    console.log('processed', processedData)

    this.setState({
      data: processedData
    })
  }

  calAvgStartTimePerWeek(res) {
    const result = {
      data: [],
      average: ''
    }
    const now = new Date()
    const nowMonth = now.getMonth()
    const nowYear = now.getFullYear()
    const nowWeek = this.calNumberOfWeek(now)

    let weekWork = new Array(7).fill()
    res.data.map( rec => {
      const start = new Date(rec.startTime)
      if((start.getFullYear() == nowYear) && (start.getMonth() == nowMonth) && (this.calNumberOfWeek(start) == nowWeek)) {
        weekWork[start.getDay()] = (start.getHours()*3600)+(start.getMinutes()*60)+(start.getSeconds())
      }
    })

    
    result.data = weekWork
    result.average = this.calAvgTime(weekWork)
    return result
    
  }

  calAvgTime(arr) {
    const avg = arr.reduce( (avg, time) => {
      return avg += time || 0
    }, 0)/arr.filter( time => time !== undefined).length || 1

    const hour = Math.floor((avg/3600))
    const min = Math.floor((avg - hour*3600)/60)
    const sec = avg - (hour * 3600) - (min * 60)

    const average = {
      hour: (hour < 10) ? '0' + hour : hour,
      min: (min < 10) ? '0' + min : min,
      sec: (sec < 10) ? '0' + sec : sec
    }
    
    return average
  }

  calNumberOfWeek(start){
    var day = start.getDate()
    day += (start.getDay() == 0 ? 0 : 7 - start.getDay());
    return Math.ceil(parseFloat(day) /7)
  }

  componentDidMount() {
    this.processData(jsonData)
    // this.setState({
    //   data: jsonData.data
    // })
    if (this.state.session === undefined)
      return

    // this.fetchAvgData()
  }

  fetchAvgData() {
    fetch(config.api + "/api/average", {
      method: "GET",
      credentials: "include"
    })
      .then(response => response.json())
      .then(json => {
        console.log('json', json)
        this.processData(jsonData)
        this.setState({
          data: jsonData.data
        })
        console.log('state', this.state.data)
      })
      .catch(err => alert(err))
  }
  
  render() {
    return (
      <div className="container-fluid">
        {/* <div className="col-md-4">
          <BarGraph labels={this.state.data} data={this.state.data}></BarGraph>
        </div> */}
        <div className="col-md-4">
          <DoughnutGraph data={this.state.data.avgStartTimePerWeek}></DoughnutGraph>
        </div>
        {/* <div className="col-md-4">
          <DoughnutGraph data={this.state.data}></DoughnutGraph>
        </div> */}
      </div>
    )
  }
}
