import React from "react";
import Modal from 'react-modal';
import {browserHistory} from 'react-router'
import ReactDOM from 'react-dom';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};


export class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      is_main: 0,
      emails: [],
      message_email: ''
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getEmails = this.getEmails.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.saveEmail = this.saveEmail.bind(this);
    this.deleteEmail = this.deleteEmail.bind(this);
  }


  handleEmailChange(e){
    var emailValid = e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    var message_email = emailValid ? '' : ' Correo Invalido';
    this.setState({message_email: message_email});
    this.setState({email: e.target.value});
  }

  handleInputChange(e){
    this.setState({is_main: !this.state.is_main});
  }

  getEmails(){
    fetch('http://149.56.47.36:5000/api/email/', {
      method: 'GET',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
      console.log(responseJson);
        this.setState({emails: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteEmail(id) {
    fetch('http://149.56.47.36:5000/api/email/'+id+'/', {
      method: 'DELETE',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getEmails();
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
    this.getEmails();

  }


  saveEmail() {

    var emailValid = (this.state.email).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (emailValid!=null){
      fetch('http://149.56.47.36:5000/api/email/', {
        method: 'POST',
        headers: {
          'Content-Type': ' application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
          is_main: this.state.is_main
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log(responseJson);
          this.setState({is_main: false});
          this.getEmails();
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }


  nextPage() {
    browserHistory.push('/phone');
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentWillMount(){
    this.getEmails();
  }

    render() {
        let that = this;
        return (
            <div>
                <h3>Agregar Emails</h3>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Principal</th>
                    <th>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
              {this.state.emails.map(function (item, i) {
                return (
                    <tr>
                      <td>{item.email}</td>
                      <td>{(item.is_main === true) ? 'Si' : 'No'}</td>
                      <td><button className="btn btn-primary" onClick={() =>that.deleteEmail(item.id)}>Eliminar</button></td>
                    </tr>
                )
              })}
                </tbody>
              </table>
              <button className="btn btn-primary" onClick={this.openModal}>Agregar Email</button>
              <button className="btn btn-primary" onClick={this.nextPage}>Siguiente</button>
              <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customStyles}
                contentLabel="Example Modal"
              >
                <h2>Agregar Email</h2>
                <br/>
                <label htmlFor="email">Email:</label>
                <br/>
                <input type="email" className="email" onChange={this.handleEmailChange}/>
                <br/>
                <label htmlFor="email">Es Principal:  </label>
                <input
                  name="main"
                  type="checkbox"
                  checked={this.state.is_main}
                  onChange={this.handleInputChange} />
                <div style={{Color: 'blue'}}>{this.state.message_email}</div>
                <br/>
                <button className="btn btn-primary" onClick={this.saveEmail}>Guardar</button>
                <button className="btn btn-primary" onClick={this.closeModal}>Cerrar</button>
              </Modal>
            </div>
        );
    }
}