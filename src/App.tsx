import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Preloader from './pages/dashboard/PreLoader';
import PageNotFound from './pages/PageNotFound';
//Auth
import Login from './Auth/Login';
//Dashboard
import DashBoard from './pages/dashboard/DashBoard';
import HomePage from './layout/HomePage';
// Trip page
import TripList from './pages/trip/List';


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
             
             {/* Trip */}
               <Route path="trip-list" element={<TripList />} />

        </Route>
        {/* Catch-All Route for 404 */}
        <Route path='*' element={<PageNotFound />} />

      </Routes>
    </>
  )
}

export default App
