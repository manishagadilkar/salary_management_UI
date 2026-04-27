import React, { useState, useEffect } from 'react';
import { getInsights, getEmployees } from '../api';
import '../styles/SalaryInsights.css';

const SalaryInsights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [countries, setCountries] = useState([]);
  const [jobTitles, setJobTitles] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const empResponse = await getEmployees();
      setEmployees(empResponse.data);

      const uniqueCountries = [...new Set(empResponse.data.map((e) => e.country).filter(Boolean))].sort();
      const uniqueJobTitles = [...new Set(empResponse.data.map((e) => e.job_title).filter(Boolean))].sort();

      setCountries(uniqueCountries);
      setJobTitles(uniqueJobTitles);

      // Fetch default insights
      await fetchInsights({});
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInsights(params);
      setInsights(response.data);
    } catch (err) {
      setError('Failed to fetch insights: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    const params = {};
    if (country) params.country = country;
    if (jobTitle) params.job_title = jobTitle;
    fetchInsights(params);
  };

  const handleReset = () => {
    setCountry('');
    setJobTitle('');
    fetchInsights({});
  };

  if (loading && !insights) {
    return <div className="loading-container">Loading salary insights...</div>;
  }

  return (
    <div className="salary-insights-container">
      <div className="insights-header">
        <h2>Salary Insights & Analytics</h2>
        <p className="subtitle">View salary statistics by country and job title</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="country-filter">Country</label>
            <select
              id="country-filter"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}
            >
              <option value="">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="job-title-filter">Job Title</label>
            <select
              id="job-title-filter"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              disabled={loading}
            >
              <option value="">All Job Titles</option>
              {jobTitles.map((jt) => (
                <option key={jt} value={jt}>
                  {jt}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-buttons">
            <button onClick={handleApplyFilters} className="btn-apply" disabled={loading}>
              {loading ? 'Loading...' : 'Apply Filters'}
            </button>
            <button onClick={handleReset} className="btn-reset" disabled={loading}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {insights && (
        <div className="insights-cards">
          <div className="insight-card">
            <div className="card-icon">👥</div>
            <div className="card-content">
              <h3>Total Employees</h3>
              <p className="metric-value">{insights.total_employees}</p>
            </div>
          </div>

          <div className="insight-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Minimum Salary</h3>
              <p className="metric-value">
                ${insights.min_salary?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>Maximum Salary</h3>
              <p className="metric-value">
                ${insights.max_salary?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

          <div className="insight-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Average Salary</h3>
              <p className="metric-value">
                ${insights.avg_salary?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>

          {insights.job_title_avg_salary && (
            <div className="insight-card highlight">
              <div className="card-icon">🎯</div>
              <div className="card-content">
                <h3>Job Title Average</h3>
                <p className="metric-value">
                  ${insights.job_title_avg_salary?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>
          )}

          {country && (
            <div className="insight-card">
              <div className="card-icon">🌍</div>
              <div className="card-content">
                <h3>Country Filter</h3>
                <p className="metric-value">{country}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="insights-table-section">
        <h3>Salary Statistics by Job Title</h3>
        <div className="table-responsive">
          <table className="insights-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Count</th>
                <th>Min Salary</th>
                <th>Max Salary</th>
                <th>Avg Salary</th>
              </tr>
            </thead>
            <tbody>
              {employees
                .reduce((acc, emp) => {
                  const jobTitle = emp.job_title;
                  const existing = acc.find((item) => item.jobTitle === jobTitle);

                  if (existing) {
                    existing.salaries.push(emp.salary);
                  } else {
                    acc.push({
                      jobTitle,
                      salaries: [emp.salary],
                    });
                  }

                  return acc;
                }, [])
                .map((item) => {
                  const salaries = item.salaries.filter((s) => s != null);
                  const minSalary = Math.min(...salaries);
                  const maxSalary = Math.max(...salaries);
                  const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;

                  return (
                    <tr key={item.jobTitle}>
                      <td>{item.jobTitle}</td>
                      <td className="centered">{salaries.length}</td>
                      <td className="salary-cell">${minSalary.toLocaleString()}</td>
                      <td className="salary-cell">${maxSalary.toLocaleString()}</td>
                      <td className="salary-cell highlight">
                        ${avgSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalaryInsights;
