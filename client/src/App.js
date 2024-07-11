import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import Intro from './components/intro/Intro'
import Login from './components/login/Login'
import Register from './components/register/Register'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import ResetPassword from './components/ResetPassword/ResetPassword'
import PreviewModal from './components/PreviewModal/PreviewModal';
import Home from './components/home/Home'

function App() {
  const { user } = useSelector((state) => state.auth)
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ !user ? <Intro /> : <Navigate to = '/home' /> }/>
        <Route path='/login' element={ !user ? <Login /> : <Navigate to='/home' />} />
        <Route path='/register' element={ !user ? <Register /> : <Navigate to='/home' />} />
        <Route path='/forgot-password' element={ !user ? <ForgotPassword /> : <Navigate to='/home' />} />
        <Route path='/reset-password/:token' element={ !user ? <ResetPassword /> : <Navigate to='/home' />} />
        <Route path='/home' element={ user ? <Home /> : <Navigate to='/login' />} />
        <Route path='/home/:familyTreeId' element={ user ? <Home /> : <Navigate to='/login' />} />
        <Route path='/preview/:familyTreeId' element={ <PreviewModal /> } />
     </Routes>
    </div>
  );
}

export default App;
