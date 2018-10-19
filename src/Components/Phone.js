import React from "react";
import Modal from 'react-modal';
import {browserHistory} from 'react-router'
import ReactDOM from 'react-dom';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

export class Phone extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            numbers: [],
            id_phone_true: null,
            id_phone_number: null,
            delete_phone: 0
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.getNumbers = this.getNumbers.bind(this);
        this.saveNumber = this.saveNumber.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.currentPrincipalNumber = this.currentPrincipalNumber.bind(this);
    }


    handleNumberChange(e) {
        this.setState({number: e.target.value});
    }


    getNumbers() {
        fetch('http://149.56.47.36:5000/api/phone/', {
            method: 'GET',
            headers: {
                'Content-Type': ' application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({numbers: responseJson});
            })
            .catch((error) => {
                console.log(error);
            });


    }

    deleteNumber(id) {
        fetch('http://149.56.47.36:5000/api/phone/' + id + '/', {
            method: 'DELETE',
            headers: {
                'Content-Type': ' application/json',
            }
        })
            .then((response) => {
                this.getNumbers();
            })
            .catch((error) => {
                console.log(error);
            });
    }


    currentPrincipalNumber() {
        fetch('http://149.56.47.36:5000/api/phone/', {
            method: 'GET',
            headers: {
                'Content-Type': ' application/json',
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                for (var i = 0; i < responseJson.length; i++) {
                    if (responseJson[i].is_main === true) {
                        this.setState({id_phone_true: responseJson[i].id});
                        this.setState({id_phone_number: responseJson[i].number});
                    }

                }

            })
            .catch((error) => {
                console.log(error);
            });
    }

    putPrincipalNumber(id, number, state) {
        fetch('http://149.56.47.36:5000/api/phone/' + this.state.id_phone_true + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify({
                user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
                number: this.state.id_phone_number,
                is_main: false,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.getNumbers();
            })
            .catch((error) => {
                console.log(error);
            });

        fetch('http://149.56.47.36:5000/api/phone/' + id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify({
                user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
                number: number,
                is_main: state,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (state === true) {
                    this.setState({id_phone_true: id});
                    this.setState({id_phone_number: number});
                }

                this.getNumbers();

            })
            .catch((error) => {
                console.log(error);
            });
        this.getNumbers();
    }

    saveNumber() {
        fetch('http://149.56.47.36:5000/api/phone/', {
            method: 'POST',
            headers: {
                'Content-Type': ' application/json',
            },
            body: JSON.stringify({
                number: this.state.number,
                user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
                is_main: false
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({is_main: false});
                this.getNumbers();
                this.closeModal();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    nextPage() {
        browserHistory.push('/password');
    }

    componentWillMount() {
        this.currentPrincipalNumber();
        this.getNumbers();
    }

    render() {
        var numberList = [];
        this.state.numbers.map((item, i) => {
            numberList.push(
                <tr>
                    <td>{item.number}</td>
                    <td>{(item.is_main === true) ? 'Si' : 'No'}</td>
                    <td>{(item.is_main === true) ? '' :
                        <button className="btn btn-primary"
                                onClick={() => this.deleteNumber(item.id)}>Eliminar</button>}</td>
                    <td>{(item.is_main === true) ? '' :
                        <button className="btn btn-primary"
                                onClick={() => this.putPrincipalNumber(item.id, item.number, true)}>
                            Numero Principal</button>}</td>
                </tr>
            )
        });
        var sty_button = {
            marginRight: '1.5rem',
        };
        return (

            <div>
                <h3>Agregar Numeros</h3>
                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th>Numero</th>
                        <th>Principal</th>
                        <th>Eliminar</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {numberList}
                    </tbody>
                </table>
                <button className="btn btn-primary" style={sty_button} onClick={this.openModal}>Agregar Numero</button>
                <button className="btn btn-primary" onClick={this.nextPage}>Siguiente</button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
                    <h2>Agregar Numero</h2>
                    <br/>
                    <label htmlFor="number">Numero:</label>
                    <br/>
                    <input type="number" className="number" onChange={this.handleNumberChange}/>
                    <br/>
                    <br/>
                    <button className="btn btn-primary" style={sty_button} onClick={this.saveNumber}>Guardar</button>
                    <button className="btn btn-primary" onClick={this.closeModal}>Cerrar</button>
                </Modal>
            </div>
        );
    }
}

