
import { useEffect, useState } from "react";
import { departmentService } from "../../services/departmentService";

export default function DepartmentDisplayPage(){

 const [departments, setDepartments] = useState([]);

 useEffect(()=>{
   loadData();
 },[]);

 const loadData = async() => {
   try{
     const data = await departmentService.getAll();
     setDepartments(data.content || data);
   }catch(err){
     console.log(err);
   }
 };

 return(
  <div>
   <div className="page-container">

    <div className="table-card">

      <h1>All Departments</h1>

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

         {departments.map((item,index)=>(
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
