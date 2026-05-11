
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { employeeService } from "../../services/employeeService";

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
         departmentId: employee.departmentId || employee.department?.id || "",
         roleId: employee.roleId || employee.role?.id || ""
       });
     } catch (err) {
       console.log(err);
       alert("Failed to load employee");
     }
   };

   loadEmployee();
 }, [id]);

 const handleChange = (e) => {

   setFormData({
     ...formData,
     [e.target.name]: e.target.value
   });

 };

 const handleSubmit = async(e) => {

   e.preventDefault();

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

      <form onSubmit={handleSubmit}>

        <div className="form-grid">

          <input name="firstName" value={formData.firstName} placeholder="First Name" required onChange={handleChange} />
          <input name="lastName" value={formData.lastName} placeholder="Last Name" required onChange={handleChange} />
          <input name="email" value={formData.email} placeholder="Email" required onChange={handleChange} />
          <input name="phone" value={formData.phone} placeholder="Phone" onChange={handleChange} />
          <input name="salary" value={formData.salary} type="number" placeholder="Salary" required onChange={handleChange} />
          <input name="hireDate" value={formData.hireDate} type="date" required onChange={handleChange} />
          <input name="departmentId" value={formData.departmentId} placeholder="Department ID" required onChange={handleChange} />
          <input name="roleId" value={formData.roleId} placeholder="Role ID" required onChange={handleChange} />

          <select name="status" value={formData.status} onChange={handleChange}>

            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="TERMINATED">TERMINATED</option>

          </select>

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
