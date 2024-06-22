import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import Intro from './components/intro/Intro'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Home from './components/home/Home'
import NavBar from './components/navbar/NavBar';

function App() {
  const { user } = useSelector((state) => state.auth)
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ !user ? <Intro /> : <Navigate to = '/home' /> }/>
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/home' />} />
        <Route path='/register' element={!user ? <Register /> : <Navigate to='/home' />} />
        <Route path='/home' element={ user ? <Home /> : <Navigate to='/login' />} />
        <Route path='/home/:familyTreeId' element={ user ? <Home /> : <Navigate to='/login' />} />
     </Routes>
    </div>
  );
}

export default App;
