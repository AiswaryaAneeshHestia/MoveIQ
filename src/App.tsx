import { Route, Routes } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Preloader from './pages/dashboard/PreLoader';
import PageNotFound from './pages/dashboard/PageNotFound';

//Auth
import Login from './Auth/Login';

//Dashboard
import DashBoard from './pages/dashboard/DashBoard';
import HomePage from './layout/HomePage';

// Trip page
import TripList from './pages/trip/List';
import TripCreate from './pages/trip/Create';

//Customer
import CustomerList from './pages/customer/List';
import CustomerCreate from './pages/customer/Create';
import CustomerEdit from './pages/customer/Edit';

//Driver
import DriverList from './pages/driver/List';

//Expense
import ExpenseList from './pages/expense/List';

//Invoice
import InvoiceMasterList from './pages/invoice/List';

//Vehicle
import VehicleList from './pages/vehicle/vehicles/List';

//Vehicle-Maintenance
import VehicleMaintenanceList from './pages/vehicle/maintenance/List';

//User
import UserList from './pages/settings/users/List';

//Company
import CompanyList from './pages/settings/company/List';
import CreateCompany from './pages/settings/company/Create';

//Expense-Type
import ExpenseTypeList from './pages/settings/expenseType/List';

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
          <Route path="trip-create" element={<TripCreate />} />

          {/* Customer */}
          <Route path="customer-list" element={<CustomerList />} />
          <Route path="customer-create" element={<CustomerCreate />} />
          <Route path="customer-edit/:customerId" element={<CustomerEdit />} />

          {/* Driver*/}
          <Route path="driver-list" element={<DriverList />} />

          {/* Invoice */}
          <Route path="invoice-list" element={<InvoiceMasterList />} />

          {/* Expense */}
          <Route path="expense-list" element={<ExpenseList />} />

          {/* Vehicles */}
          <Route path="vehicle/vehicle-list" element={<VehicleList />} />

          {/* Vehicles-Maintenance */}
          <Route path="vehicle/maintenance-list" element={<VehicleMaintenanceList />} />

          {/* User */}
          <Route path="settings/user-list" element={<UserList />} />

          {/* Company */}
          <Route path="settings/company-list" element={<CompanyList />} />
          <Route path="settings/create-company" element={<CreateCompany />} />

          {/* Expense Type */}
          <Route path="settings/expense-type-list" element={<ExpenseTypeList />} />

        </Route>
        {/* Catch-All Route for 404 */}
        <Route path='*' element={<PageNotFound />} />


      </Routes>
    </>
  )
}

export default App
