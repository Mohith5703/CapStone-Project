
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function EmployeeDisplayPage(){

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

 if (id) {
  return(
   <div>
    <div className="page-container">
     <div className="form-card detail-card">
      <h1>Employee Details</h1>

      {employee ? (
       <div className="detail-grid">
        <div>
         <span>Name</span>
         <strong>{fullName(employee)}</strong>
        </div>
        <div>
         <span>Email</span>
         <strong>{employee.email || employee.emailId || "-"}</strong>
        </div>
        <div>
         <span>Phone</span>
         <strong>{employee.phone || "-"}</strong>
        </div>
        <div>
         <span>Status</span>
         <strong>{employee.status || "-"}</strong>
        </div>
        <div>
         <span>Department</span>
         <strong>{displayValue(employee.departmentName || employee.department)}</strong>
        </div>
        <div>
         <span>Role</span>
         <strong>{displayValue(employee.roleName || employee.role)}</strong>
        </div>
        <div>
         <span>Salary</span>
         <strong>{employee.salary || "-"}</strong>
        </div>
        <div>
         <span>Employee ID</span>
         <strong>{employee.id || employee.employeeId || employee._id || id}</strong>
        </div>
       </div>
      ) : (
       <p>Loading employee details...</p>
      )}
     </div>
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
