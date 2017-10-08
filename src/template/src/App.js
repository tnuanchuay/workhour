import React, { Component } from 'react'
import Navbar from './Components/Navbar'
import './App.css'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Menu from './menu.js'
import Home from './Components/HomePage.js'
import Login from './Components/LoginPage.js'
import { Cookies, CookiesProvider } from 'react-cookie'
import StatisticPage from './Components/StatisticPage'
import CalendarPage from './Components/Calendarpage'
const brand = "workhour.life"

class App extends Component {

  constructor(prop) {
    super(prop)
    this.cookies = new Cookies()

    this.state = { session: this.cookies.get('SESSIONID') || undefined }
    this.router = Router;
  }

  redirectIfNoSession() {
    if (this.state.session === undefined) {
      return <Redirect to="login" />
    }
  }

  onLogin(app){
    return (token) => {
      app.setState({session:token})
      window.sessionStorage.setItem("SESSIONID", token)
      this.cookies.set("SESSIONID", token)
      window.location = "/"
    }
  }

  render() {
    return (
      <CookiesProvider>
        <Router>
          <div>
            <Navbar menu={Menu} brand={brand} session={this.state.session} cookies={this.cookies}/>
            {this.redirectIfNoSession()}
            <Route exact path="/login" component={() => <Login cookies={this.cookies} onLogin={this.onLogin(this)}/>} />
            <Route exact path="/" component={() => <Home cookies={this.cookies} session={this.state.session}/>}  />
            <Route exact path="/calendar" component={() => <CalendarPage />} />
            <Route exact path="/stat" component={() => <StatisticPage />} />
          </div>
        </Router>
      </CookiesProvider>
    )
  }
}

export default App;
