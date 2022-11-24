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
        <div className="row justify-content-md-center">
          <h1>hey</h1>
        </div>
        <div className="row">
          <div className="col">1Password 1.0</div>
          <div className="col-md-auto">
            {/* Variable width content */}
            <SankeyChart />
          </div>
          <div className="col col-lg-2">1Password 2.0</div>
        </div>
      </div>
    </div>
  );
}
export default App;
