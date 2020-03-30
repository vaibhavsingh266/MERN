import React, { Component } from 'react'
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ReactDOM from 'react-dom';


class NavbarComponent extends Component {
    constructor(props)  {
        super(props);
}
logOut()    {
    sessionStorage.clear();
    {
        return <Redirect to='/login'/>
      }
}
 render(){
return(

<header className="App-header">
        <Navbar bg="dark" variant="dark">

          <Container>

            <Navbar.Brand>
              <Link to={"/create-student"} className="nav-link">
                React MERN
              </Link>
            </Navbar.Brand>

            <Nav className="justify-content-end">
              <Nav>
                <Link to={"/create-student"} className="nav-link">
                  Create Student
                </Link>
              </Nav>

              {/* <Nav>
                <Link to={"/search"} className="nav-link">
                  Search
                </Link>
              </Nav> */}

              <Nav>
                <Link to={"/student-list"} className="nav-link">
                  Student List
                </Link>
              </Nav>
              <div >
                <button className="btn btn-dark" onClick={this.logOut.bind(this)}>Log out</button>
                </div>
            </Nav>

          </Container>
        </Navbar>
      </header>

)} }

export default NavbarComponent;