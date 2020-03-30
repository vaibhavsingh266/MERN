import React, { Component } from 'react'


class HeaderComponent extends Component {
    constructor(props)  {
        super(props);
        this.state = {};
    }

    render()    {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
            <div className="container">
                <div className="navbar-header" style={{'font-weight': 'bold'}}>
                    <a className="navbar-brand" href="#">{this.props.name}: </a>
                </div>
            </div>
        </nav>
        );
    }
}

export default HeaderComponent;