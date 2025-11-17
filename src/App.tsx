
import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import KiduTable from './components/KiduTable'
import { Button } from 'react-bootstrap';

function App() {


  return (
    <>
     <h1>Routes <Button className='text-danger'>Click</Button></h1>
     <Routes>
       <Route path="/dashboard" element={<KiduTable/>}/>   
     </Routes>
    </>
  )
}

export default App
