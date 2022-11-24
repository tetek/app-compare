// import logo from './logo.svg';
import "./App.css";
// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

// import React from 'react'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import SankeyChart from "./components/sankeyChart";
function App() {
  return (
    <div className="App">
      <div className="container">
      <div className="row">.</div>
        <div className="row justify-content-md-center title">
          <h1>App size comparison</h1>
        </div>
        <SankeyChart />        
      </div>
    </div>
  );
}
export default App;
