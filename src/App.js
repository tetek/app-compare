// import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

// import React from 'react'
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import SankeyChart from './components/sankeyChart'
function App() {
  return (
    <div className="App">
      <SankeyChart />
    </div>
  )
}
export default App