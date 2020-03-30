import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Universities, Courses } from './constants';
import SelectComponent from './selectComponent';

export default class EditStudent extends Component {

  constructor(props) {
    super(props);

    this.onChangeStudentName = this.onChangeStudentName.bind(this);
    this.getSelectedUniversity = this.getSelectedUniversity.bind(this);
    this.onChangeStudentStudentId = this.onChangeStudentStudentId.bind(this);
    this.onChangeStudentFees = this.onChangeStudentFees.bind(this);
    this.onChangeStudentYear = this.onChangeStudentYear.bind(this);
    this.getSelectedCourse = this.getSelectedCourse.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    
    this.token = '';

    // State
    this.state = {
      StudentName: '',
      University: '',
      StudentId: 0,
      Year:'',
      universities: Universities,
      courses: Courses,
      Fees:0
    }
  }

  // componentDidMount() {
  //   axios.get('http://localhost:4000/edit-student/' + this.props.match.params.id)
  //     .then(res => {
  //       this.setState({
  //         StudentName: res.data.StudentName,
  //         University: res.data.University,
  //         StudentId: res.data.StudentId,
  //         Course: res.data.Course,
  //         Fees: res.data.Fees
  //       });
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }
  componentDidMount=()=>{
    let tk = sessionStorage.getItem('token');
    if(tk !== null)    {
        this.token = tk;
    }
    else{
        this.props.history.push('/login');
    }
}
  onChangeStudentName(e) {
    this.setState({ StudentName: e.target.value })
  }

  onChangeStudentStudentId(e) {
    this.setState({ StudentId: e.target.value })
  }
  getSelectedUniversity(val) {
    //console.log(`Vaule Received from SelectComponent ${val}`);
    this.setState({University: val})
  }
  getSelectedCourse(val) {
    //console.log(`Vaule Received from SelectComponent ${val}`);
    this.setState({Course: val})
  }
  onChangeStudentYear(e) {
    this.setState({Year: e.target.value})
  }
  onChangeStudentFees(e) {
    this.setState({Fees: e.target.value})
  }

  onSubmit(e) {
    e.preventDefault()

    const studentObject = {
      StudentName: this.state.StudentName,
      University: this.state.University,
      StudentId: this.state.StudentId,
      Course: this.state.Course,
      Year:this.state.Year,
      Fees: this.state.Fees

    };
  
     // let response = axios.put(`${this.url}/${student.StudentId}`, student,
     
    axios.put('http://localhost:4000/update-student/'+this.props.match.params.id, studentObject,{
      headers: {
        'Content-type': 'application/json',
        'AUTHORIZATION': `Bearer ${this.token}`
              }
    })
      .then((res) => {
        console.log(res.data)
        console.log('Student successfully updated')
        window.location.reload(false);
      }).catch((error) => {
        console.log(error)
      })

    // Redirect to Student List 
    this.props.history.push('/student-list')
  }


  render() {
    return (<div className="form-wrapper">
      <Form onSubmit={this.onSubmit}>
      <Form.Group controlId="Name">
          <Form.Label>StudentId</Form.Label>
          <Form.Control type="text" value={this.props.match.params.id} onChange={this.props.match.params.id} />
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Student Name</Form.Label>
          <Form.Control type="text" value={this.state.StudentName} onChange={this.onChangeStudentName} />
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>University</Form.Label>
          {/* <Form.Control type="text" value={this.state.University} onChange={this.onChangeUniversity}/> */}
          <SelectComponent name="University" data={this.state.University} selectedValue={this.getSelectedUniversity.bind(this)} value={this.state.University} dataSource={this.state.universities}></SelectComponent>
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Courses</Form.Label>
          {/* <Form.Control type="text" value={this.state.University} onChange={this.onChangeUniversity}/> */}
          <SelectComponent name="Course" data={this.state.Course} selectedValue={this.getSelectedCourse.bind(this)} dataSource={this.state.courses}></SelectComponent>
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Year</Form.Label>
          <Form.Control type="text" value={this.state.Year} onChange={this.onChangeStudentYear} />
        </Form.Group>

        <Form.Group controlId="Name">
          <Form.Label>Fees</Form.Label>
          <Form.Control type="text" value={this.state.Fees} onChange={this.onChangeStudentFees} />
        </Form.Group>

        <Button variant="danger" size="lg" block="block" type="submit">
          Update Student
        </Button>
      </Form>
    </div>);
  }
}