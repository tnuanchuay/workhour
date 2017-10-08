import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = props.menu
        this.brand = props.brand
        this.session = props.session
        this.cookies = props.cookies
    }

    logout() {
        this.cookies.remove("SESSIONID")
        window.location = "/"
    }

    logoutButton() {
        if (this.cookies.get("SESSIONID") !== undefined) {
            return (<div className="navbar-nav ml-auto">
                <li className="nav-item">
                    <a className="nav-link active" role="button" onClick={this.logout.bind(this)}>Logout</a>
                </li>
            </div>)
        }else{
            return null
        }
    }

    render() {
        let menu = this.createMenu()
        return (
            <nav className="navbar fixed-top navbar-inverse bg-inverse navbar-toggleable-md navbar-light bg-faded">
                <Link className="navbar-brand" to="/" onClick={this.setActive.bind(this, "Home")}>{this.brand}</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav mr-auto">
                        {menu}
                    </ul>
                </div>
                {this.logoutButton()}
            </nav>
        )
    }

    setActive(name) {
        let newState = this.state.menu.map((item) => {
            item.name === name ? item.isActive = true : item.isActive = false
            return item
        })
        this.setState(newState)
    }

    createMenu() {
        if (this.session) {
            return this.state.menu.map((item) => {
                var liClass = "nav-item " + (item.isActive ? "active" : "")
                return (
                    <li className={liClass} key={item.name}>
                        <Link className="nav-link" role="button" onClick={this.setActive.bind(this, item.name)} to={`${item.url}`} >
                            {item.name}
                        </Link>
                    </li>
                )
            })
        }
    }
}

export default Navbar