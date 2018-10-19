import React from "react";
import {browserHistory} from 'react-router'

export class PersonalInformation extends React.Component {

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
        this.saveUserInformation = this.saveUserInformation.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleDniChange = this.handleDniChange.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    handleFirstNameChange(e) {
        this.setState({first_name: e.target.value});
    }

    handleLastNameChange(e) {
        this.setState({last_name: e.target.value});
    }

    handleDniChange(e) {
        this.setState({dni: e.target.value});
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

    nextPage() {
        browserHistory.push('/email');
    }

    saveUserInformation() {
        fetch('http://149.56.47.36:5000/api/userkrowdy/1/', {
            method: 'PUT',
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                dni: this.state.dni,
                password: this.state.password,
                address: this.state.address,
                username: this.state.username
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({message: 'Se guardo con exito'});
            })
            .catch((error) => {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getUserInformation();
    }


    render() {
        var sty_button = {
            marginRight: '1.5rem',
        };
        return (
            <div>
                <h3>Datos Personales</h3>
                <label>
                    Nombres:
                </label>
                <br/>
                <input type="text" name="first_name" value={this.state.first_name}
                       onChange={this.handleFirstNameChange}/>

                <br/>
                <label>
                    Apellidos:
                </label>
                <br/>
                <input type="text" name="last_name" value={this.state.last_name} onChange={this.handleLastNameChange}/>
                <br/>
                <label>
                    DNI:
                </label>
                <br/>
                <input type="text" name="dni" value={this.state.dni} onChange={this.handleDniChange}/>
                <br/>
                <div>{this.state.message}</div>
                <br/>
                <button onClick={this.saveUserInformation} style={sty_button} className="btn btn-primary">Guardar
                </button>
                <button onClick={this.nextPage} className="btn btn-primary">Siguiente</button>
            </div>
        );
    }
}