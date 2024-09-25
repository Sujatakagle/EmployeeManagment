import React, { useState, useEffect } from 'react';
import './App.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: '',
    name: '',
    department: '',
    phone_number: '',
    email: '',
    position: '',
    location: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch('http://localhost:4000/employees');
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEmployees = [...employees];

    if (form.id) {
      const index = updatedEmployees.findIndex(emp => emp.id === form.id);
      updatedEmployees[index] = { ...form };
    } else {
      const newId = updatedEmployees.length ? updatedEmployees[updatedEmployees.length - 1].id + 1 : 1;
      updatedEmployees.push({ ...form, id: newId });
    }

    setEmployees(updatedEmployees);
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    const updatedEmployees = employees.filter(employee => employee.id !== id);
    setEmployees(updatedEmployees);
  };

  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      department: '',
      phone_number: '',
      email: '',
      position: '',
      location: '',
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Employee List', 14, 16);
    doc.setFontSize(12); // Set font size for the table
    autoTable(doc, {
      html: '#employee-table',
      startY: 30, // Start table 30 units down
      margin: { top: 20 }, // Add margin from the top
    });
    doc.save('employee_list.pdf');
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (departmentFilter ? employee.department === departmentFilter : true)
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>Employee Management System</h1>
        <div className="filter-container">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
          </select>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="input-container">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-button">Save</button>
      </form>

      <table className="employee-table" id="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Department</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Position</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.email}</td>
                <td>{employee.position}</td>
                <td>{employee.location}</td>
                <td>
                  <button onClick={() => handleEdit(employee)}>Update</button>
                  <button onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Employee</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phone_number}
                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Position"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
