import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; 
import ProjectsListPage from './pages/ProjectsListPage'; 
import WorkDetails from './pages/WorkDetails';
import EditWorkPage from './pages/EditWorkPage';
import EmployeesPage from './pages/EmployeesPage';
import EditEmployeePage from './pages/EditEmployeePage';
import EditContractPage from './pages/EditContractPage';
import EditExpensePage from './pages/EditExpensePage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Dashboard</Link>
          <Link to="/projects" style={{ marginRight: '15px' }}>Obras</Link>
          <Link to="/employees">Funcionários</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsListPage />} />
          <Route path="/project/:id" element={<WorkDetails />} />
          <Route path="/project/edit/:id" element={<EditWorkPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/employee/edit/:id" element={<EditEmployeePage />} />
        <Route path="/contract/edit/:id" element={<EditContractPage />} />
          <Route path="/expense/edit/:id" element={<EditExpensePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;