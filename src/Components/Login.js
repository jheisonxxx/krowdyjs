import React from "react";
import {browserHistory} from "react-router";


export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            dni: '',
            username: '',
            password: '',
            address: '',
            message: ''

        };
        this.getUserInformation = this.getUserInformation.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.login = this.login.bind(this);

    }

    onNavigate() {
        browserHistory.push("/personal_information");
    }


    handleUsernameChange(e) {
        this.setState({user_name: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }


    login() {
        fetch('http://149.56.47.36:5000/api/userkrowdy/1/', {
            method: 'GET',
            headers: {
                'Content-Type': ' application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.username === this.state.username && responseJson.password === this.state.password) {
                    this.onNavigate()
                } else {
                    this.setState({message: 'Tu usuario no existe, o contraseña mal ingresada'});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getUserInformation();
    }


    getUserInformation() {
        fetch('http://149.56.47.36:5000/api/userkrowdy/1/', {
            method: 'GET',
            headers: {
                'Content-Type': ' application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({first_name: responseJson.first_name});
                this.setState({last_name: responseJson.last_name});
                this.setState({dni: responseJson.dni});
                this.setState({username: responseJson.username});
                this.setState({password: responseJson.password});
                this.setState({address: responseJson.address});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <label htmlFor="username">Usuario:</label>
                <br/>
                <input type="text" className="username" onChange={this.handleUsernameChange}/>
                <br/>
                <label htmlFor="Contraseña">Contraseña:</label>
                <br/>
                <input type="password" className="password" onChange={this.handlePasswordChange}/>
                <div>{this.state.message}</div>
                <br/>
                <button onClick={this.login} className="btn btn-primary">Iniciar Sesion</button>
            </div>
        );
    }
}