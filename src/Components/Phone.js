import React from "react";
import Modal from 'react-modal';
import {browserHistory} from 'react-router'

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

export class Phone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      is_main: 0,
      numbers: [],
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getNumbers = this.getNumbers.bind(this);
    this.saveNumber = this.saveNumber.bind(this);
    this.deleteNumber = this.deleteNumber.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }


  handleNumberChange(e){
    this.setState({number: e.target.value});
  }

  handleInputChange(e){
    this.setState({is_main: !this.state.is_main});
  }

  getNumbers(){
    fetch('http://149.56.47.36:5000/api/phone/', {
      method: 'GET',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({numbers: responseJson});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  deleteNumber(id) {
    fetch('http://149.56.47.36:5000/api/phone/'+id+'/', {
      method: 'DELETE',
      headers: {
        'Content-Type': ' application/json',
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.getNumbers();
        console.log(responseJson);
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
          is_main: this.state.is_main
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({is_main: false});
          this.getNumbers();
          this.closeModal();
          console.log(responseJson);
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
    this.getNumbers();
  }

  render() {
    let that = this;
    return (
      <div>
          <h3>Agregar Numeros</h3>
          <table className="table table-bordered">
              <thead>
              <tr>
                  <th>Numero</th>
                  <th>Principal</th>
                  <th>Eliminar</th>
              </tr>
              </thead>
              <tbody>
              {this.state.numbers.map(function (item, i) {
                return (
                  <tr>
                      <td>{item.number}</td>
                      <td>{(item.is_main === true) ? 'Si' : 'No'}</td>
                      <td><button className="btn btn-primary" onClick={() =>that.deleteNumber(item.id)}>Eliminar</button></td>
                  </tr>
                )
              })}
              </tbody>
          </table>
          <button className="btn btn-primary" onClick={this.openModal}>Agregar Numero</button>
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
              <label htmlFor="email">Es Principal:  </label>
              <input
                name="main"
                type="checkbox"
                checked={this.state.is_main}
                onChange={this.handleInputChange} />
              <br/>
              <button className="btn btn-primary" onClick={this.saveNumber}>Guardar</button>
              <button className="btn btn-primary" onClick={this.closeModal}>Cerrar</button>
          </Modal>
      </div>
    );
  }
}