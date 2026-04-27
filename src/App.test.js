import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import SalaryInsights from './components/SalaryInsights';
import '@testing-library/jest-dom';

// Mock the api module
jest.mock('./api', () => ({
  getEmployees: jest.fn(),
  createEmployee: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  getInsights: jest.fn(),
}));

describe('EmployeeList Component', () => {
  const mockEmployees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      job_title: 'Engineer',
      country: 'USA',
      salary: 100000,
      department: 'Engineering',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      job_title: 'Manager',
      country: 'Canada',
      salary: 120000,
      department: 'Sales',
    },
  ];

  beforeEach(() => {
    const api = require('./api');
    api.getEmployees.mockResolvedValue({ data: mockEmployees });
    api.deleteEmployee.mockResolvedValue({});
  });

  test('renders employee list with data', async () => {
    render(<EmployeeList onEdit={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('displays employee details correctly', async () => {
    render(<EmployeeList onEdit={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('Engineer')).toBeInTheDocument();
      expect(screen.getByText('USA')).toBeInTheDocument();
    });
  });

  test('filters employees by search term', async () => {
    render(<EmployeeList onEdit={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name or job title...');
    await userEvent.type(searchInput, 'Jane');

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('calls onEdit when edit button is clicked', async () => {
    const mockOnEdit = jest.fn();
    render(<EmployeeList onEdit={mockOnEdit} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockEmployees[0]);
  });

  test('displays total employee count', async () => {
    render(<EmployeeList onEdit={jest.fn()} refreshTrigger={0} />);

    await waitFor(() => {
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<EmployeeList onEdit={jest.fn()} refreshTrigger={0} />);
    expect(screen.getByText('Loading employees...')).toBeInTheDocument();
  });
});

describe('EmployeeForm Component', () => {
  beforeEach(() => {
    const api = require('./api');
    api.createEmployee.mockResolvedValue({
      data: {
        id: 3,
        first_name: 'Bob',
        last_name: 'Johnson',
        job_title: 'Developer',
        country: 'UK',
        salary: 95000,
        department: 'Engineering',
      },
    });
  });

  test('renders form for new employee', () => {
    render(
      <EmployeeForm
        employee={null}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Add New Employee')).toBeInTheDocument();
  });

  test('populates form with employee data for editing', () => {
    const employee = {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      job_title: 'Engineer',
      country: 'USA',
      salary: 100000,
      department: 'Engineering',
    };

    render(
      <EmployeeForm
        employee={employee}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', () => {
    const mockOnCancel = jest.fn();

    render(
      <EmployeeForm
        employee={null}
        onSuccess={jest.fn()}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });
});

describe('SalaryInsights Component', () => {
  const mockEmployees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      job_title: 'Engineer',
      country: 'USA',
      salary: 100000,
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      job_title: 'Manager',
      country: 'USA',
      salary: 120000,
    },
  ];

  const mockInsights = {
    total_employees: 2,
    min_salary: 100000,
    max_salary: 120000,
    avg_salary: 110000,
  };

  beforeEach(() => {
    const api = require('./api');
    api.getEmployees.mockResolvedValue({ data: mockEmployees });
    api.getInsights.mockResolvedValue({ data: mockInsights });
  });

  test('renders salary insights cards', async () => {
    render(<SalaryInsights />);

    await waitFor(() => {
      expect(screen.getByText('Total Employees')).toBeInTheDocument();
      expect(screen.getByText('Minimum Salary')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(<SalaryInsights />);
    expect(screen.getByText('Loading salary insights...')).toBeInTheDocument();
  });

  test('displays salary statistics table', async () => {
    render(<SalaryInsights />);

    await waitFor(() => {
      expect(screen.getByText('Salary Statistics by Job Title')).toBeInTheDocument();
    });
  });
});

