import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/context/AuthContext';
import { employeeService } from '../employeeService';
import { type Employee } from '../employee.types';

const EmployeeDetailPage = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            loadEmployee();
        }
    }, [id]);

    const loadEmployee = async () => {
        setLoading(true);
        try {
            const response = await employeeService.getById(id!);
            setEmployee(response.data);
        } catch (err: any) {
            setError('Failed to load employee details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await employeeService.delete(id!);
                navigate('/employees');
            } catch (err) {
                setError('Failed to delete employee');
            }
        }
    };

    if (loading) return <div>Loading employee details...</div>;
    if (error) return <div>{error}</div>;
    if (!employee) return <div>Employee not found</div>;

    return (
        <div>
            <div>
                <button onClick={() => navigate('/employees')}>
                    ← Back
                </button>
                <h2>Employee Details</h2>
                {isAdmin && (
                    <div>
                        <button onClick={() => navigate(`/employees/${id}/edit`)}>
                            Edit
                        </button>
                        <button onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div>
                <div>
                    <h3>Personal Information</h3>
                    <div>
                        <div>
                            <label>Full Name:</label>
                            <p>{employee.fullName}</p>
                        </div>
                        <div>
                            <label>Email:</label>
                            <p>{employee.email}</p>
                        </div>
                        <div>
                            <label>Phone:</label>
                            <p>{employee.phone || 'N/A'}</p>
                        </div>
                        <div>
                            <label>Status:</label>
                            <p>{employee.status}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Employment Information</h3>
                    <div>
                        <div>
                            <label>Department:</label>
                            <p>{employee.departmentName}</p>
                        </div>
                        <div>
                            <label>Role:</label>
                            <p>{employee.roleName}</p>
                        </div>
                        <div>
                            <label>Hire Date:</label>
                            <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
                        </div>
                        {isAdmin && employee.salary && (
                            <div>
                                <label>Salary:</label>
                                <p>₹{employee.salary.toLocaleString('en-IN')}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h3>System Information</h3>
                    <div>
                        <div>
                            <label>Employee ID:</label>
                            <p>{employee.id}</p>
                        </div>
                        <div>
                            <label>Created At:</label>
                            <p>{new Date(employee.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <label>Updated At:</label>
                            <p>{new Date(employee.updatedAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailPage;