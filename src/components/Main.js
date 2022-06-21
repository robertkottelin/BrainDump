import React, { Component } from 'react';
import Identicon from 'identicon.js';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto mx-auto" style={{ width: '100%' }}>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const data = this.dataContent.value
                  const date = this.dataDate.value
                  this.props.setData(data, date)
                }}>
                <p>&nbsp;</p>
                <div className="form-group mr-sm-2">
                  <input
                    id="dataContent"
                    type="text"
                    ref={(input) => { this.dataContent = input }}
                    className="form-control"
                    placeholder="Vaccine"
                    required />
                </div>
                <div className="form-group mr-sm-2">
                  <input

                    id="dataContent"
                    type="text"
                    ref={(input1) => { this.dataDate = input1 }}
                    className="form-control"
                    placeholder="Date: YYYYMMDD"

                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Dump</button>            
              </form>
              <p>&nbsp;</p>
              { this.props.datamapping.map((data, key) => {
                return(
                  <div className="card justify center mx-auto" style={{ width: '100%' }} key={key} >
                    <div className="card-header">
                      <img
                        className='mr-2'
                        width='30'
                        height='30'
                        src={`data:image/png;base64,${new Identicon(data.author, 30).toString()}`}
                      />
                      <small className="text-muted">Author: {data.author}</small>
                    </div>
                    <ul id="postList" className="list-group list-group-flush">
                      <li className="list-group-item">
                        <p>{data.dataContent}</p>
                      </li>
                      <li key={key} className="list-group-item py-2">
                        <small className="float-left mt-1 text-muted">

                        </small>
                        <small className="float-left mt-1 text-muted">
                          {date} 

                        </small>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={data.id}
                          onClick={(event) => {
                            console.log(data.id)
                            this.props.deleteData(data.id)
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={data.id}
                          onClick={(event) => {
                            console.log(data.id)
                            this.props.deleteData(data.id)
                          }}
                        >
                          Date {data.date}
                        </button>
                        <button
                          className="btn btn-link btn-sm float-right pt-0"
                          name={data.id}
                          onClick={(event) => {
                            let tipAmount = window.web3.utils.toWei('0.001', 'Ether')
                            console.log(event.target.name, tipAmount)
                            this.props.payPatient(event.target.name, tipAmount)
                          }}
                        >
                          
                        </button>
                      </li>
                    </ul>
                  </div>
                )
              })}
              <p>&nbsp;</p>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Main;
