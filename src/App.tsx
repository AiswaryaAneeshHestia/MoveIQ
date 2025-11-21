import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Login from './Auth/Login';
import Preloader from './pages/dashboard/PreLoader';
import PageNotFound from './pages/PageNotFound';
import DashBoard from './pages/dashboard/DashBoard';
import HomePage from './layout/HomePage';


function App() {


  return (
    <>
      <Routes>
        {/* Preloader */}
        <Route path='/' element={<Preloader />} />
        <Route path="/login" element={<Login />} />


        {/* Homepage */}
        <Route path="/dashboard" element={<DashBoard />}>
             <Route index element={<HomePage />} />


        </Route>
        {/* Catch-All Route for 404 */}
        <Route path='*' element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App
