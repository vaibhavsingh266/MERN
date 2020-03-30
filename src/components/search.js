import React, { Component } from 'react';
import SecureCallService from './services/securecallservice';

class Search extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            search: '',
            checkUniversity: true,
            checkCourse: false,
            error: false,
            update: false
        };
        // define an instancve of HTTP Service
        this.serv = new SecureCallService();
        this.token = ''; 
    }
    loadData=()=>{
        this.serv.getStudents(this.token)
        .then((response)=>{
            console.log(response.data.data);
            if(response.data.statusCode === 401)    {
                this.props.history.push('/login');
            }
            this.setState({'students': response.data.data});
        })
        .catch((error)=>{            
            console.log(`Error Occured ${error}`);
        });
    }
searchString(evt)  {
    this.setState({search: evt.target.value});
}

selectOption(evt)  {
    this.setState({option: evt.target.value});
    if(evt.target.value === "University")   {
        this.setState({checkUniversity: true});
        this.setState({checkCourse: false});
    }
    if(evt.target.value === "Course")   {
        this.setState({checkUniversity: false});
        this.setState({checkCourse: true});
    }

}
searchRecords() {
    this.serv.searchStudents(this.state.search, this.state.option, this.token)
    .then((response)=> {
        if(response.data.statusCode === 404)    {
            let student = [{
                Username:'',
                StudentName: '',
                University: '',
                Course: '',
                Year: '',
                Fees: ''
            }, response.data.statusCode];
            this.setState({students: student});
        }
        else{
        this.setState({students: response.data.data});
        }
    }).catch((error)=>{
        console.log(`Error Occured ${error}`);
    });
    
}

onEveryCharCheck(evt)    {
    if(evt.target.value === '') {
        this.loadData();
    }
}
render()
{
    let styleSearch = {float: 'right', 'margin-right': 40};
return(
     <div style={{marginBottom: '8%'}}>
                <div style={styleSearch} >
                    <button className="btn btn-primary" onClick={this.searchRecords.bind(this)}>Search</button>
                </div>
                <div style={styleSearch}>
                <span className="glyphicon glyphicon-search"></span>
                <input type="text" id="search" className="form-control form-control-md"  placeholder="Search" value={this.state.search} onChange={this.searchString.bind(this)} onKeyUp={this.onEveryCharCheck.bind(this)}/>
                </div>
                <div className="form-group" style={styleSearch} >
                <input type="radio" className="custom-control-input"   id="CourseOption" value="Course" onChange={this.selectOption.bind(this)}   name="selectOption" checked={this.state.checkCourse}/>
                <label className="custom-control-label" for="CourseOption">Course</label>
                </div>
                <div className="form-group" style={styleSearch} >
                <input type="radio" className="custom-control-input"  id="uniOption" value="University" onChange={this.selectOption.bind(this)}   name="selectOption" checked={this.state.checkUniversity}/>
                <label className="custom-control-label" for="uniOption">University</label>
                </div>
                </div>);
                
            
            
            }
            
        }
export default Search;