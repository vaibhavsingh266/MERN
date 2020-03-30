import React, { Component } from "react";
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import StudentTableRow from './StudentTableRow';
import NavbarComponent from './navbar';


export default class StudentList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      students: [],
    };
    this.token = '';
  }

  componentDidMount() {
    let tk = sessionStorage.getItem('token');
    if(tk !== null)    {
        this.token = tk;
    }
    else{
        this.props.history.push('/login');
    }
    axios.get('http://localhost:4000/', {
      headers: {
          'AUTHORIZATION': `Bearer ${this.token}`}
      })
      .then(res => {
        this.setState({
        students: res.data.data
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  DataTable() {
    let data = Array.from(this.state.students);
    return data.map((res, i) => {
      return <StudentTableRow obj={res} key={i} />;
    });
  }


  render() {
    return (<div className="table-wrapper">
      <NavbarComponent></NavbarComponent>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student Id</th>
            <th>Name</th>
            <th>Universities</th>
            <th>Courses</th>
            <th>Year</th>
            <th>Fees</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {this.DataTable()}
        </tbody>
      </Table>
    </div>);
  }
}