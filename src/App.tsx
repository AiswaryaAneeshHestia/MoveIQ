import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Preloader from './pages/dashboard/PreLoader';
import PageNotFound from './pages/PageNotFound';

function App() {


  return (
    <>
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
