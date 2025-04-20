import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.module.scss';
import AddFlight from './components/add-flight/add-flight';
import FlightBoard from './components/flight-board/flight-board';
import Home from './components/home/home';
import Header from './components/layout/header/header';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='*' element={<Navigate to='/' />} />
        <Route path='/' element={<Home />} />
        <Route path='/board' element={<FlightBoard />} />
        <Route path='/add' element={<AddFlight />} />
      </Routes>
    </Router>
  )
}

export default App

