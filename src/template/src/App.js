import React, { Component } from 'react'
import Navbar from './components/navbar'
import './App.css'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Menu from './menu.js'
import Home from './components/home.js'
import Login from './components/login.js'
import { Cookies, CookiesProvider } from 'react-cookie'
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
            <Route exact path="/stat" component={() => (<div>Stat
            asdasd
            asd
            asdasdas\
            asdasdaqwe</div>)} />
          </div>
        </Router>
      </CookiesProvider>
    )
  }
}

export default App;
