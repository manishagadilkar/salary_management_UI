import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../api';
import '../styles/EmployeeForm.css';

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    emp_id: '',
    first_name: '',
    last_name: '',
    job_title: '',
    country: '',
    salary: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        emp_id: employee.emp_id || '',
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        job_title: employee.job_title || '',
        country: employee.country || '',
        salary: employee.salary || '',
        department: employee.department || '',
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    setApiStatus(employee?.id ? 'Updating employee...' : 'Creating employee...');

    try {
      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.job_title || !formData.country || !formData.salary) {
        setError('All fields are required');
        setApiStatus('✗ Validation failed: All fields are required');
        setLoading(false);
        return;
      }

      if (employee?.id) {
        // Update existing employee
        await updateEmployee(employee.id, formData);
        setSuccess(true);
        setApiStatus(`✓ Employee updated successfully`);
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        // Create new employee
        await createEmployee(formData);
        setSuccess(true);
        setApiStatus(`✓ Employee created successfully`);
        setFormData({
          emp_id: '',
          first_name: '',
          last_name: '',
          job_title: '',
          country: '',
          salary: '',
          department: '',
        });
        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      }
    } catch (err) {
      const errorMsg = 'Error saving employee: ' + (err.response?.data?.message || err.message);
      setError(errorMsg);
      setApiStatus(`✗ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-form-container">
      <div className="form-card">
        <h2>{employee?.id ? 'Edit Employee' : 'Add New Employee'}</h2>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Employee saved successfully!</div>}
        {apiStatus && <div className="api-status-message">{apiStatus}</div>}

        <form onSubmit={handleSubmit} className="employee-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="emp_id">Employee ID</label>
              <input
                id="emp_id"
                name="emp_id"
                type="text"
                placeholder="EMP001"
                value={formData.emp_id}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="John"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Doe"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job_title">Job Title *</label>
              <input
                id="job_title"
                name="job_title"
                type="text"
                placeholder="Senior Engineer"
                value={formData.job_title}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="United States"
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="salary">Salary (USD) *</label>
              <input
                id="salary"
                name="salary"
                type="number"
                placeholder="120000"
                value={formData.salary}
                onChange={handleChange}
                disabled={loading}
                required
                min="0"
                step="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                placeholder="Engineering"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="year_started">Year Started</label>
              <input
                id="year_started"
                name="year_started"
                type="number"
                placeholder="2020"
                value={formData.year_started}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
                value={formData.department}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : employee?.id ? 'Update Employee' : 'Add Employee'}
            </button>

            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
