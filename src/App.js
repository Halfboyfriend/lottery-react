import React from 'react'
import './App.css';
import LotteryApp from './components/LotteryApp';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
 
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<LotteryApp />} />
          {/* <Route exact path='/tx' element={<TxDetail />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
