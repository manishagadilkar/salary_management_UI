import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee, getEmployee } from '../api';
import '../styles/EmployeeList.css';

const EmployeeList = ({ onEdit, refreshTrigger }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, [refreshTrigger]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    setApiStatus('Fetching employees...');
    try {
      const response = await getEmployees();
      setEmployees(response.data);
      setApiStatus(`✓ Successfully loaded ${response.data.length} employees`);
      setTimeout(() => setApiStatus(null), 3000);
    } catch (err) {
      const errorMsg = 'Failed to fetch employees: ' + err.message;
      setError(errorMsg);
      setApiStatus(`✗ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDetails = async (id) => {
    setDetailsLoading(true);
    setApiStatus(`Fetching employee details...`);
    try {
      const response = await getEmployee(id);
      setEmployeeDetails(response.data);
      setApiStatus(`✓ Employee details loaded`);
      setTimeout(() => setApiStatus(null), 2000);
    } catch (err) {
      const errorMsg = 'Failed to fetch employee details: ' + err.message;
      setApiStatus(`✗ ${errorMsg}`);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setApiStatus('Deleting employee...');
      try {
        await deleteEmployee(id);
        setApiStatus('✓ Employee deleted successfully');
        setSelectedEmployee(null);
        setEmployeeDetails(null);
        setTimeout(() => setApiStatus(null), 2000);
        fetchEmployees();
      } catch (err) {
        const errorMsg = 'Failed to delete employee: ' + err.message;
        setApiStatus(`✗ ${errorMsg}`);
      }
    }
  };

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee.id === selectedEmployee ? null : employee.id);
    if (employee.id !== selectedEmployee) {
      fetchEmployeeDetails(employee.id);
    }
  };

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.job_title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCountry = !filterCountry || emp.country === filterCountry;

    return matchesSearch && matchesCountry;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIdx = (page - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIdx, startIdx + itemsPerPage);

  // Get unique countries for filter
  const countries = [...new Set(employees.map((emp) => emp.country).filter(Boolean))].sort();

  if (loading) {
    return <div className="loading-container">Loading employees...</div>;
  }

  return (
    <div className="employee-list-container">
      <div className="list-header">
        <h2>Employees Database</h2>
        <p className="total-count">Total: {employees.length} employees</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {apiStatus && <div className="api-status-message">{apiStatus}</div>}

      <div className="filters-section">
        <input
          type="text"
          placeholder="Search by name or job title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <select
          value={filterCountry}
          onChange={(e) => {
            setFilterCountry(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Job Title</th>
              <th>Country</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length > 0 ? (
              paginatedEmployees.map((employee) => (
                <React.Fragment key={employee.id}>
                  <tr 
                    className={`employee-row ${selectedEmployee === employee.id ? 'active' : ''}`}
                    onClick={() => handleRowClick(employee)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{employee.id}</td>
                    <td className="employee-name">
                      {employee.first_name} {employee.last_name}
                    </td>
                    <td>{employee.job_title}</td>
                    <td>{employee.country}</td>
                    <td className="salary-cell">
                      ${employee.salary?.toLocaleString() || 'N/A'}
                    </td>
                    <td>{employee.department || 'N/A'}</td>
                    <td className="action-buttons" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEdit(employee)}
                        className="btn-edit"
                        title="Edit employee"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="btn-delete"
                        title="Delete employee"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedEmployee === employee.id && employeeDetails && (
                    <tr className="details-row">
                      <td colSpan="7">
                        <div className="employee-details-panel">
                          <h3>Employee Details</h3>
                          {detailsLoading ? (
                            <p>Loading details...</p>
                          ) : (
                            <div className="details-grid">
                              <div className="detail-item">
                                <span className="label">ID:</span>
                                <span className="value">{employeeDetails.id}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Name:</span>
                                <span className="value">{employeeDetails.first_name} {employeeDetails.last_name}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Email:</span>
                                <span className="value">{employeeDetails.email || 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Job Title:</span>
                                <span className="value">{employeeDetails.job_title}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Department:</span>
                                <span className="value">{employeeDetails.department || 'N/A'}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Country:</span>
                                <span className="value">{employeeDetails.country}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Salary:</span>
                                <span className="value salary">${employeeDetails.salary?.toLocaleString()}</span>
                              </div>
                              <div className="detail-item">
                                <span className="label">Joined Date:</span>
                                <span className="value">{employeeDetails.created_at ? new Date(employeeDetails.created_at).toLocaleDateString() : 'N/A'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <div className="page-info">
            Page {page} of {totalPages}
          </div>

          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
