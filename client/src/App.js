import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    callBackendAPI()
      .then(res => setData(res.express))
      .catch(err => console.log(err))
  })

  const callBackendAPI = async () => {
    const response = await fetch('/express_backend')
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <p className="App-intro">{data}</p>
    </div>
  );
}

export default App;
