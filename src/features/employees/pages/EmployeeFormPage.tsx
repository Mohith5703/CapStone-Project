import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../employeeService';
import type { EmployeeRequest } from '../employee.types';

const EmployeeFormPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState<EmployeeRequest>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        salary: 0,
        hireDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        departmentId: '',
        roleId: ''
    });

    useEffect(() => {
        if (isEditMode) {
            loadEmployee();
        }
    }, [id]);

    const loadEmployee = async () => {
        setLoading(true);
        try {
            const response = await employeeService.getById(id!);
            const emp = response.data;
            setFormData({
                firstName: emp.firstName,
                lastName: emp.lastName,
                email: emp.email,
                phone: emp.phone || '',
                salary: emp.salary || 0,
                hireDate: emp.hireDate,
                status: emp.status,
                departmentId: emp.departmentId,
                roleId: emp.roleId
            });
        } catch (err) {
            setError('Failed to load employee');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isEditMode) {
                await employeeService.update(id!, formData);
            } else {
                await employeeService.create(formData);
            }
            navigate('/employees');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' ? parseFloat(value) : value
        }));
    };

    if (loading && isEditMode) return <div>Loading...</div>;

    return (
        <div>
            <div>
                <button onClick={() => navigate('/employees')}>
                    ← Back
                </button>
                <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
            </div>

            {error && <div>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <h3>Personal Information</h3>
                    <div>
                        <div>
                            <label>First Name *</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Last Name *</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Employment Information</h3>
                    <div>
                        <div>
                            <label>Salary *</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Hire Date *</label>
                            <input
                                type="date"
                                name="hireDate"
                                value={formData.hireDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <label>Status *</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="TERMINATED">TERMINATED</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3>Department & Role</h3>
                    <div>
                        <div>
                            <label>Department ID *</label>
                            <input
                                type="text"
                                name="departmentId"
                                value={formData.departmentId}
                                onChange={handleChange}
                                placeholder="Enter department ID"
                                required
                            />
                        </div>
                        <div>
                            <label>Role ID *</label>
                            <input
                                type="text"
                                name="roleId"
                                value={formData.roleId}
                                onChange={handleChange}
                                placeholder="Enter role ID"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <button type="button" onClick={() => navigate('/employees')}>
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeFormPage;