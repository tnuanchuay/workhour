import React, { Component } from 'react'
import 'whatwg-fetch'
import config from '../config/appConfig'
import Graph from './graph'

// sample data
let jsonData = {
  data: [3,2,3,4,5,6,7,8,9]
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
