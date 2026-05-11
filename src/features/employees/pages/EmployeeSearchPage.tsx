import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService } from '../employeeService';
import { type Employee } from '../employee.types';

const EmployeeSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await employeeService.search(searchTerm);
      setResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => navigate('/employees')}>
          ← Back
        </button>
        <h2>Search Employees</h2>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by first or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {searched && (
        <div>
          <h3>Results ({results.length})</h3>
          {results.length === 0 ? (
            <p>No employees found matching "{searchTerm}"</p>
          ) : (
            <table border={1}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.fullName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.departmentName}</td>
                    <td>{emp.roleName}</td>
                    <td>
                      <button onClick={() => navigate(`/employees/${emp.id}`)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeSearchPage;