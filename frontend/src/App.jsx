// Local: frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorksList from './components/WorksList';
import WorkDetails from './pages/WorkDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WorksList />} />
          <Route path="/project/:id" element={<WorkDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;