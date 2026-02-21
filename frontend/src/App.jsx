import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import WorkersInfo from './pages/WorkersInfo';
import AddWorker from './pages/AddWorker';
import WorkerRegister from './pages/WorkerRegister';
import Materials from './pages/Materials';
import Production from './pages/Production';
import Clients from './pages/Clients';
import Orders from './pages/Orders';
import Invoice from './pages/Invoice';
import Payroll from './pages/Payroll';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('auth') === 'true'
  );

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="workers" element={<WorkersInfo />} />
          <Route path="workers/add" element={<AddWorker />} />
          <Route path="register" element={<WorkerRegister />} />
          <Route path="materials" element={<Materials />} />
          <Route path="production" element={<Production />} />
          <Route path="sales/clients" element={<Clients />} />
          <Route path="sales/orders" element={<Orders />} />
          <Route path="finance/invoice" element={<Invoice />} />
          <Route path="finance/payroll" element={<Payroll />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
