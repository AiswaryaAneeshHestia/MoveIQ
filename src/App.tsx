import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Button } from 'react-bootstrap';
import Login from './Auth/Login';


function App() {


  return (
    <>
     <Routes>
       <Route path="/" element={<Login/>}/>   
     </Routes>
      <Routes>

        {/* Auth */}
        <Route path='/' element={<Preloader />} />

        
          {/* Catch-All Route for 404 */}
          <Route path='*' element={<PageNotFound />} />
          
      </Routes>
    </>
  )
}

export default App
