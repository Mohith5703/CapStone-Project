
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { departmentService } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService";
import { roleService } from "../../services/roleService";

export default function EmployeeFormPage(){

 const navigate = useNavigate();
 const { id } = useParams();
 const isEdit = Boolean(id);

 const [formData,setFormData] = useState({
   firstName:"",
   lastName:"",
   email:"",
   phone:"",
   salary:0,
   hireDate:"",
   status:"ACTIVE",
   departmentId:"",
   roleId:""
 });
 const [departments,setDepartments] = useState<any[]>([]);
 const [roles,setRoles] = useState<any[]>([]);
 const [errors,setErrors] = useState<Record<string, string>>({});

 const getList = (response: any) => {
   if (Array.isArray(response)) return response;
   if (Array.isArray(response?.content)) return response.content;
   if (Array.isArray(response?.data)) return response.data;
   if (Array.isArray(response?.data?.content)) return response.data.content;
   return [];
 };

 const getOptionId = (item: any) => item.id || item._id;
 const getDepartmentName = (department: any) => (
   department.name || department.departmentName || department.title || getOptionId(department)
 );
 const getRoleName = (role: any) => (
   role.name || role.roleName || role.title || getOptionId(role)
 );

 useEffect(() => {
   const loadOptions = async () => {
     try {
       const [departmentResponse, roleResponse] = await Promise.all([
         departmentService.getAll(),
         roleService.getAll()
       ]);

       setDepartments(getList(departmentResponse));
       setRoles(getList(roleResponse));
     } catch (err) {
       console.log(err);
       alert("Failed to load departments or roles");
     }
   };

   loadOptions();
 }, []);

 useEffect(() => {
   if (!id) return;

   const loadEmployee = async () => {
     try {
       const employee = await employeeService.getById(id);
       setFormData({
         firstName: employee.firstName || "",
         lastName: employee.lastName || "",
         email: employee.email || "",
         phone: employee.phone || "",
         salary: employee.salary || 0,
         hireDate: employee.hireDate ? String(employee.hireDate).slice(0, 10) : "",
         status: employee.status || "ACTIVE",
         departmentId: employee.departmentId || employee.department?.id || employee.department?._id || "",
         roleId: employee.roleId || employee.role?.id || employee.role?._id || ""
       });
     } catch (err) {
       console.log(err);
       alert("Failed to load employee");
     }
   };

   loadEmployee();
 }, [id]);

 const validateForm = () => {
   const nextErrors: Record<string, string> = {};
   const firstName = formData.firstName.trim();
   const lastName = formData.lastName.trim();
   const email = formData.email.trim();
   const phone = formData.phone.trim();
   const salary = Number(formData.salary);

   if (!firstName) {
     nextErrors.firstName = "First name is required";
   } else if (firstName.length < 2) {
     nextErrors.firstName = "Minimum 2 characters required";
   }

   if (!lastName) {
     nextErrors.lastName = "Last name is required";
   } else if (lastName.length < 2) {
     nextErrors.lastName = "Minimum 2 characters required";
   }

   if (!email) {
     nextErrors.email = "Email is required";
   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
     nextErrors.email = "Enter a valid email address";
   }

   if (phone && !/^\d{10}$/.test(phone)) {
     nextErrors.phone = "Phone number must be 10 digits";
   }

   if (!formData.salary && formData.salary !== 0) {
     nextErrors.salary = "Salary is required";
   } else if (Number.isNaN(salary) || salary <= 0) {
     nextErrors.salary = "Salary must be greater than 0";
   }

   if (!formData.hireDate) {
     nextErrors.hireDate = "Hire date is required";
   }

   if (!formData.departmentId) {
     nextErrors.departmentId = "Select a department";
   }

   if (!formData.roleId) {
     nextErrors.roleId = "Select a role";
   }

   setErrors(nextErrors);
   return Object.keys(nextErrors).length === 0;
 };

 const handleChange = (e: any) => {
   const { name, value } = e.target;

   setFormData({
     ...formData,
     [name]: value
   });

   if (errors[name]) {
     setErrors({
       ...errors,
       [name]: ""
     });
   }

 };

 const handleSubmit = async(e: any) => {

   e.preventDefault();

   if (!validateForm()) return;

   try{

     const payload = {
       ...formData,
       salary:Number(formData.salary)
     };

     if (id) {
       await employeeService.update(id, payload);
     } else {
       await employeeService.create(payload);
     }

     alert(isEdit ? "Employee Updated Successfully" : "Employee Added Successfully");

     navigate("/employees");

   }catch(err){

     console.log(err);
     alert(isEdit ? "Failed to update employee" : "Failed to add employee");

   }

 };

 return(
  <div>

   <div className="page-container">

    <div className="form-card">

      <h1>{isEdit ? "Edit Employee" : "Add New Employee"}</h1>

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-grid">

          <div className="form-field">
            <label htmlFor="firstName">First Name *</label>
            <input id="firstName" name="firstName" value={formData.firstName} placeholder="First Name" required minLength={2} onChange={handleChange} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "firstName-error" : undefined} />
            {errors.firstName && <p id="firstName-error" className="form-error">{errors.firstName}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last Name *</label>
            <input id="lastName" name="lastName" value={formData.lastName} placeholder="Last Name" required minLength={2} onChange={handleChange} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "lastName-error" : undefined} />
            {errors.lastName && <p id="lastName-error" className="form-error">{errors.lastName}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" value={formData.email} placeholder="Email" required onChange={handleChange} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
            {errors.email && <p id="email-error" className="form-error">{errors.email}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={formData.phone} placeholder="Phone" onChange={handleChange} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />
            {errors.phone && <p id="phone-error" className="form-error">{errors.phone}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="salary">Salary *</label>
            <input id="salary" name="salary" value={formData.salary} type="number" placeholder="Salary" required min={1} onChange={handleChange} aria-invalid={Boolean(errors.salary)} aria-describedby={errors.salary ? "salary-error" : undefined} />
            {errors.salary && <p id="salary-error" className="form-error">{errors.salary}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="hireDate">Hire Date *</label>
            <input id="hireDate" name="hireDate" value={formData.hireDate} type="date" required onChange={handleChange} aria-invalid={Boolean(errors.hireDate)} aria-describedby={errors.hireDate ? "hireDate-error" : undefined} />
            {errors.hireDate && <p id="hireDate-error" className="form-error">{errors.hireDate}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="departmentId">Department Name *</label>
            <select id="departmentId" name="departmentId" value={formData.departmentId} required onChange={handleChange} aria-invalid={Boolean(errors.departmentId)} aria-describedby={errors.departmentId ? "departmentId-error" : undefined}>
              <option value="">Select Department</option>
              {departments.map((department) => {
                const departmentId = getOptionId(department);
                return (
                  <option key={departmentId} value={departmentId}>
                    {getDepartmentName(department)}
                  </option>
                );
              })}
            </select>
            {errors.departmentId && <p id="departmentId-error" className="form-error">{errors.departmentId}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="roleId">Role Name *</label>
            <select id="roleId" name="roleId" value={formData.roleId} required onChange={handleChange} aria-invalid={Boolean(errors.roleId)} aria-describedby={errors.roleId ? "roleId-error" : undefined}>
              <option value="">Select Role</option>
              {roles.map((role) => {
                const roleId = getOptionId(role);
                return (
                  <option key={roleId} value={roleId}>
                    {getRoleName(role)}
                  </option>
                );
              })}
            </select>
            {errors.roleId && <p id="roleId-error" className="form-error">{errors.roleId}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>

            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="TERMINATED">TERMINATED</option>

            </select>
          </div>

        </div>

        <div className="btn-group">

          <button type="button" className="secondary-btn" onClick={()=>navigate("/employees")}>
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {isEdit ? "Update Employee" : "Create Employee"}
          </button>

        </div>

      </form>

    </div>

   </div>

  </div>
 )
}
