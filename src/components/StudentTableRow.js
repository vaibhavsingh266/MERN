import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';

export default class StudentTableRow extends Component {

    constructor(props) {
        super(props);
        this.deleteStudent = this.deleteStudent.bind(this);
        this.token = ''; 
    }
    componentDidMount=()=>{
        let tk = sessionStorage.getItem('token');
        if(tk !== null)    {
            this.token = tk;
        }
        else{
            this.props.history.push('/login');
        }
    }

    deleteStudent() {
        axios.delete('http://localhost:4000/delete-student/' + this.props.obj.StudentId,{
            headers: {
                'AUTHORIZATION': `Bearer ${this.token}`
            }
        })
            .then((res) => {
                {console.log('Student successfully deleted!')
                alert(`record ${this.props.obj.StudentId} deleted`);
                window.location.reload(false);}
            }).catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            <tr>
                <td>{this.props.obj.StudentId}</td>
                <td>{this.props.obj.StudentName}</td>
                <td>{this.props.obj.University}</td>
                <td>{this.props.obj.Course}</td>
                <td>{this.props.obj.Year}</td>
                <td>{this.props.obj.Fees}</td>            
                <td>
                    <Link className="edit-link" to={"/edit-student/"+ this.props.obj.StudentId}>
                        Edit
                    </Link>
                    <Button onClick={this.deleteStudent} size="sm" variant="danger">Delete</Button>
                </td>
            </tr>
        );
    }
}