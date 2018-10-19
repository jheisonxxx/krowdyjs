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


export class Email extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      emails: [],
      message_email: '',
      id_email_true: null,
      id_email: null
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.getEmails = this.getEmails.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.saveEmail = this.saveEmail.bind(this);
    this.deleteEmail = this.deleteEmail.bind(this);
    this.currentPrincipalEmail = this.currentPrincipalEmail.bind(this);
  }


  handleEmailChange(e) {
    var emailValid = e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    var message_email = emailValid ? '' : ' Correo Invalido';
    this.setState({message_email: message_email});
    this.setState({email: e.target.value});
  }


  getEmails() {
    fetch('http://149.56.47.36:5000/api/email/', {
      method: 'GET',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({emails: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteEmail(id) {
    fetch('http://149.56.47.36:5000/api/email/' + id + '/', {
      method: 'DELETE',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getEmails();
      })
      .catch((error) => {
        console.log(error);
      });
    this.getEmails();

  }


  currentPrincipalEmail() {
    fetch('http://149.56.47.36:5000/api/email/', {
      method: 'GET',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        for (var i = 0; i < responseJson.length; i++) {
          if (responseJson[i].is_main === true) {
            this.setState({id_email_true: responseJson[i].id});
            this.setState({id_email: responseJson[i].email});
          }

        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  saveEmail() {

    var emailValid = (this.state.email).match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    if (emailValid != null) {
      fetch('http://149.56.47.36:5000/api/email/', {
        method: 'POST',
        headers: {
          'Content-Type': ' application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
          is_main: false
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.getEmails();
          this.closeModal();
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }

  putPrincipalEmail(id, email, state) {
    fetch('http://149.56.47.36:5000/api/email/' + this.state.id_email_true + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': ' application/json',
      },
      body: JSON.stringify({
        user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
        email: this.state.id_email,
        is_main: false,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getEmails();
      })
      .catch((error) => {
        console.log(error);
      });

    fetch('http://149.56.47.36:5000/api/email/' + id + '/', {
      method: 'PUT',
      headers: {
        'Content-Type': ' application/json',
      },
      body: JSON.stringify({
        user: 'http://149.56.47.36:5000/api/userkrowdy/1/',
        email: email,
        is_main: state,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (state === true) {
          this.setState({id_email_true: id});
          this.setState({id_email: email});
        }

        this.getEmails();

      })
      .catch((error) => {
        console.log(error);
      });
    this.getEmails();
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

  componentWillMount() {
    this.currentPrincipalEmail()
    this.getEmails();
  }

  render() {
    var emailList = [];
    this.state.emails.map((item, i) => {
      emailList.push(
        <tr>
          <td>{item.email}</td>
          <td>{(item.is_main === true) ? 'Si' : 'No'}</td>
          <td>{(item.is_main === true) ? '' :
            <button className="btn btn-primary" onClick={() => this.deleteEmail(item.id)}>Eliminar</button>}</td>
          <td>{(item.is_main === true) ? '' :
            <button className="btn btn-primary" onClick={() => this.putPrincipalEmail(item.id, item.email, true)}>Email
              Principal</button>}</td>
        </tr>
      )
    })
    return (
      <div>
        <h3>Agregar Emails</h3>
        <table className="table table-bordered">
          <thead>
          <tr>
            <th>Email</th>
            <th>Principal</th>
            <th>Eliminar</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {emailList}
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
          <div style={{Color: 'blue'}}>{this.state.message_email}</div>
          <br/>
          <button className="btn btn-primary" onClick={this.saveEmail}>Guardar</button>
          &nbsp;&nbsp;&nbsp;
          <button className="btn btn-primary" onClick={this.closeModal}>Cerrar</button>
        </Modal>
      </div>
    );
  }
}
