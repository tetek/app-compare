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
      <div className="row">
      
      <i>Click on one of: "no size chage", "grew" or "shrinked" to zoom in.</i><br />
        <i>This project is based on JSON representation of 1Password app internals from EmergeTools. The supposed 8.0.0 is the same JSON with random modifications just to represent the potential diff.</i>
        
      </div>
    </div>
  );
}
export default App;
