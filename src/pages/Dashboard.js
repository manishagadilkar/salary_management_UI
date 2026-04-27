import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import SalaryInsights from '../components/SalaryInsights';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
    setActiveTab('employees');
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Salary Manager</h1>
          <div className="header-right">
            <span className="user-info">
              Welcome, <strong>{user?.name || 'User'}</strong>
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-btn ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('employees');
            setShowForm(false);
          }}
        >
          👥 Employees
        </button>
        <button
          className={`nav-btn ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('insights');
            setShowForm(false);
          }}
        >
          📊 Salary Insights
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'employees' && (
          <div className="tab-content">
            {!showForm && (
              <div className="employees-header">
                <h2>Employee Management</h2>
                <button onClick={handleAddNew} className="btn-primary">
                  + Add New Employee
                </button>
              </div>
            )}

            {showForm ? (
              <EmployeeForm
                employee={selectedEmployee}
                onSuccess={handleFormSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setSelectedEmployee(null);
                }}
              />
            ) : (
              <EmployeeList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="tab-content">
            <SalaryInsights />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
