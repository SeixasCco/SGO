import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import WorksList from './components/WorksList';
import WorkDetails from './pages/WorkDetails';
import EditWorkPage from './pages/EditWorkPage';
import EmployeesPage from './pages/EmployeesPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">        
        <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Obras</Link>
          <Link to="/employees">Funcionários</Link>
        </nav>

        <Routes>
          <Route path="/" element={<WorksList />} />
          <Route path="/project/:id" element={<WorkDetails />} />
          <Route path="/project/edit/:id" element={<EditWorkPage />} />
          <Route path="/employees" element={<EmployeesPage />} /> 
          <Route path="/employee/:id" element={<EmployeeDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;