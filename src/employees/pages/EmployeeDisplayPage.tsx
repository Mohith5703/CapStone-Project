
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { employeeService } from "../../services/employeeService";

type Employee = Record<string, any>;

const getList = (data: any): Employee[] => data?.content || data || [];

const fullName = (employee: Employee) =>
  employee.name ||
  [employee.firstName, employee.lastName].filter(Boolean).join(" ") ||
  "Unnamed Employee";

const displayValue = (value: any, fallback = "-") => {
  if (!value) return fallback;
  if (typeof value === "object") return value.name || value.departmentName || value.roleName || fallback;
  return value;
};

const getId = (employee: Employee) => employee.id || employee.employeeId || employee._id;

const getInitials = (employee: Employee) => {
  const parts = fullName(employee).split(" ").filter(Boolean);
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : fullName(employee).slice(0, 2).toUpperCase();
};

const formatDate = (value: any) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatSalary = (value: any) => {
  if (!value && value !== 0) return "-";
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function EmployeeDisplayPage(){

 const navigate = useNavigate();
 const { id } = useParams();
 const [employees, setEmployees] = useState<Employee[]>([]);
 const [employee, setEmployee] = useState<Employee | null>(null);

 useEffect(()=>{
   loadData();
 },[id]);
 // loading employees
 const loadData = async() => {
   try{
     if (id) {
       const data = await employeeService.getById(id);
       setEmployee(data.data || data);
       return;
     }

     const data = await employeeService.getAll();
     setEmployees(getList(data));
   }catch(err){
     console.log(err);
   }
 };

 const terminateEmployee = async () => {
   if (!employee) return;
   const employeeId = getId(employee) || id;
   if (!employeeId) {
     alert("Employee id is missing");
     return;
   }

   if (!window.confirm("Terminate this employee?")) return;

   try {
     const updatedEmployee = { ...employee, status: "TERMINATED" };
     await employeeService.update(employeeId, updatedEmployee);
     setEmployee(updatedEmployee);
     alert("Employee terminated successfully");
   } catch (err) {
     console.log(err);
     alert("Failed to terminate employee");
   }
 };

 if (id) {
  return(
   <div className="employee-profile-page">
    <div className="employee-profile-shell">

      {employee ? (
       <div className="employee-profile-card">
        <section className="employee-profile-hero">
         <div className="employee-profile-identity">
          <div className="employee-avatar">{getInitials(employee)}</div>
          <div>
           <h1>{fullName(employee)}</h1>
           <div className="employee-profile-badges">
            <span>{employee.status || "ACTIVE"}</span>
            <span>{displayValue(employee.roleName || employee.role, "Employee")}</span>
           </div>
          </div>
         </div>

         <div className="employee-profile-actions">
          <button type="button" className="employee-edit-btn" onClick={() => navigate(`/employees/edit/${getId(employee) || id}`)}>
           Edit Profile
          </button>
          <button type="button" className="employee-terminate-btn" onClick={terminateEmployee}>
           Terminate
          </button>
         </div>
        </section>

        <section className="employee-profile-details">
         <div className="employee-detail-section">
          <h2>Contact Information</h2>
          <div className="employee-detail-list">
           <div className="employee-detail-item">
            <span>Email</span>
            <strong>{employee.email || employee.emailId || "-"}</strong>
           </div>
           <div className="employee-detail-item">
            <span>Phone</span>
            <strong>{employee.phone || "-"}</strong>
           </div>
          </div>
         </div>

         <div className="employee-detail-section">
          <h2>Employment Details</h2>
          <div className="employee-detail-list">
           <div className="employee-detail-item">
            <span>Department</span>
            <strong>{displayValue(employee.departmentName || employee.department)}</strong>
           </div>
           <div className="employee-detail-item">
            <span>Hire Date</span>
            <strong>{formatDate(employee.hireDate || employee.joiningDate)}</strong>
           </div>
           <div className="employee-detail-item">
            <span>Base Salary</span>
            <strong>{formatSalary(employee.salary || employee.baseSalary)}</strong>
           </div>
          </div>
         </div>
        </section>
       </div>
      ) : (
       <div className="employee-profile-card employee-profile-loading">
        Loading employee details...
       </div>
      )}
    </div>
   </div>
  )
 }

 return(
  <div>
   <div className="page-container">

    <div className="table-card">

      <h1>All Employees</h1>

      <div className="table-wrapper">

       <table className="data-table">

        <thead>
         <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description/Email</th>
         </tr>
        </thead>

        <tbody>

         {employees.map((item,index)=>(
           <tr key={index}>
             <td>{item.id || item._id}</td>
             <td>{item.name || `${item.firstName || ""} ${item.lastName || ""}`}</td>
             <td>{item.description || item.email}</td>
           </tr>
         ))}

        </tbody>

       </table>

      </div>

    </div>

   </div>

  </div>
 )
}
