import React from "react";

export class Password extends React.Component {
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
        this.savePasswordInformation = this.savePasswordInformation.bind(this);
        this.handleOldPasswordChange = this.handleOldPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.handleNewPassword2Change = this.handleNewPassword2Change.bind(this);
    }

    handleOldPasswordChange(e) {
        this.setState({old_password: e.target.value});
    }

    handleNewPasswordChange(e) {
        this.setState({new_password: e.target.value});
    }

    handleNewPassword2Change(e) {
        this.setState({new_password2: e.target.value});
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

    savePasswordInformation() {
        var status = 1;
        var message = '';
        if (this.state.old_password !== this.state.password) {
            message += 'Tu contraseña anterior no concuerda - ';
            status = 0;
        }
        if (this.state.new_password !== this.state.new_password2) {
            message += 'Las contraseñas nuevas no concuerdan';
            status = 0;
        }

        this.setState({message: message});

        if (status === 1) {
            fetch('http://149.56.47.36:5000/api/userkrowdy/1/', {
                method: 'PUT',
                headers: {
                    'Content-Type': ' application/json',
                },
                body: JSON.stringify({
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    dni: this.state.dni,
                    password: this.state.new_password,
                    address: this.state.address,
                    username: this.state.username
                })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({old_password: ''});
                    this.setState({new_password: ''});
                    this.setState({new_password2: ''});
                    this.setState({message: 'Guardado con exito'});
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        return (
            <div>
                <h3>Cambiar Contraseña</h3>
                <label htmlFor="old_password">Antigua Contraseña:</label>
                <br/>
                <input type="password" className="old_password" onChange={this.handleOldPasswordChange}/>
                <br/>
                <label htmlFor="new_password">Nueva Contraseña:</label>
                <br/>
                <input type="password" className="new_password" onChange={this.handleNewPasswordChange}/>
                <br/>
                <label htmlFor="new_password2">Nueva Contraseña x 2:</label>
                <br/>
                <input type="password" className="new_password2" onChange={this.handleNewPassword2Change}/>
                <div>{this.state.message}</div>
                <br/>
                <button onClick={this.savePasswordInformation} className="btn btn-primary">Guardar</button>
            </div>
        );
    }
}