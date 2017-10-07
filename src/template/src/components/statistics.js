import React, { Component } from 'react'
import 'whatwg-fetch'
import config from '../config/appConfig'
import Graph from './graph'

// sample data
let jsonData = {
  data: [
    {
      "_id" : ObjectId("59d08f4131ad137215815fd4"),
      "endTime" : NumberLong(1506840385898),
      "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
      "startTime" : NumberLong(1506782500413)
    },
    {
        "_id" : ObjectId("59d22b8e31ad13721581bab0"),
        "session" : "fe878058a3816944cfe0e5677eb7f7d9334dd78fa17c9aeb146555d4cd74b040dbdebb0df30949c000160ce92ce477132035aa2fb18ced97bfe5e462d5ff2816",
        "startTime" : NumberLong(1506913457109),
        "endTime" : NumberLong(1506945934765)
    }
  ]
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

  processData(data) {
    const processedData = data.map( rec => {
      
    })
  }

  componentDidMount() {
    if (this.state.session === undefined)
      return

    fetch(config.api + "/api/average", {
        method: "GET",
        credentials: "include"
    })
      .then(response => response.json())
      .then(json => {
        console.log('json', json)
        this.setState({
          data: jsonData.data
        })
        console.log('state', this.state.data)
      })
      .catch(err => alert(err))

  }
  
  render() {
    return (
      <div>
        <Graph data={this.state.data}></Graph>
      </div>
    )
  }
}
