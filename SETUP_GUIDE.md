# Salary Manager - Complete Setup Guide

## Overview
- **Frontend**: React App (Port 3000)
- **Backend**: Ruby on Rails API (Port 3001)

---

## QUICK START - Frontend (React)

### 1. Install Dependencies
```bash
cd /Users/sandeepvavhal/Desktop/ManishaWorkspace/salary-manager/salary-ui
npm install
```

**What this does**: Installs all npm packages including react, react-dom, and react-scripts.

### 2. Start Development Server
```bash
npm start
```

**Output**: Opens browser at http://localhost:3000

---

## QUICK START - Backend (Ruby on Rails)

### Prerequisites
- Ruby 3.0+ installed (`ruby --version`)
- Rails 7.0+ installed (`rails --version`)
- PostgreSQL installed and running

### 1. Create Rails API Project (if not exists)
```bash
cd /Users/sandeepvavhal/Desktop/ManishaWorkspace/salary-manager
rails new salary-api --api --database=postgresql
cd salary-api
```

### 2. Configure CORS (Allow Frontend to Connect)
**Edit**: `Gemfile`
```ruby
gem 'rack-cors'
```

**Run**:
```bash
bundle install
```

**Edit**: `config/initializers/cors.rb`
```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'localhost:3000'
    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete]
  end
end
```

### 3. Create Employee API Endpoints
```bash
rails generate scaffold Employee name:string salary:decimal department:string year_started:integer
rails db:create
rails db:migrate
```

### 4. (Optional) Add Salary Insights Endpoint
**Edit**: `app/controllers/employees_controller.rb`
```ruby
def salary_insights
  @insights = Employee.group(:department).average(:salary)
  render json: @insights
end
```

**Edit**: `config/routes.rb`
```ruby
Rails.application.routes.draw do
  resources :employees do
    collection do
      get :salary_insights
    end
  end
end
```

### 5. Start Rails Server
```bash
rails server -p 3001
```

**Output**: Server running at http://localhost:3001

---

## Running Both Together (Terminal Setup)

### Terminal 1: Run React Frontend
```bash
cd /Users/sandeepvavhal/Desktop/ManishaWorkspace/salary-manager/salary-ui
npm start
```

### Terminal 2: Run Rails Backend
```bash
cd /Users/sandeepvavhal/Desktop/ManishaWorkspace/salary-manager/salary-api
rails server -p 3001
```

---

## API Endpoints Your React App Uses

### 1. Get All Employees
```
GET http://localhost:3001/employees
```
**React Call**: `getEmployees()`

### 2. Get Salary Insights by Department
```
GET http://localhost:3001/employees/salary_insights
```
**React Call**: `getInsights({ department: 'Engineering' })`

---

## Configuration Options

### Change API Port (Rails)
To use a different port instead of 3001:
```bash
rails server -p 5000
```
Then update `.env`:
```
REACT_APP_API_BASE_URL=http://localhost:5000
```

### Change Frontend Port (React)
```bash
PORT=3000 npm start
```

### Production Environment
Create `.env.production`:
```
REACT_APP_API_BASE_URL=https://your-domain.com/api
```

---

## Troubleshooting

### Issue: "Cannot POST /employees"
- Check Rails server is running on port 3001
- Verify CORS is configured correctly

### Issue: CORS Error in Browser
- Make sure `rack-cors` gem is installed
- Verify `origins 'localhost:3000'` in `config/initializers/cors.rb`

### Issue: "localhost:3000 refused to connect"
- React dev server not running
- Run `npm start` in salary-ui directory

### Issue: Database errors in Rails
- Run `rails db:create` and `rails db:migrate`
- Check PostgreSQL is installed and running

---

## File Structure

```
salary-manager/
├── salary-ui/              (React Frontend)
│   ├── src/
│   │   ├── api.js         (API calls)
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env              (Configuration)
│   └── public/
│
└── salary-api/            (Rails Backend)
    ├── app/
    │   ├── controllers/
    │   ├── models/
    │   └── serializers/
    ├── config/
    │   ├── initializers/cors.rb
    │   └── routes.rb
    ├── db/
    │   └── migrate/
    └── Gemfile
```

---

## Key Files Already Fixed

✅ **src/api.js** - Updated API_BASE URL to use environment variable
✅ **.env** - Created with API_BASE_URL configuration

## Next Steps

1. ✅ Install npm dependencies in salary-ui
2. ✅ Start React dev server
3. ⏳ Create Rails API project (if not exists)
4. ⏳ Configure CORS in Rails
5. ⏳ Create Employee scaffold in Rails
6. ⏳ Start Rails server
7. ⏳ Test API endpoints from React app
