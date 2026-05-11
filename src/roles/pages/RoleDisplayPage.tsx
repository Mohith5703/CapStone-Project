
import { useEffect, useState } from "react";
import { roleService } from "../../services/roleService";

export default function RoleDisplayPage(){

 const [roles, setRoles] = useState([]);

 useEffect(()=>{
   loadData();
 },[]);

 const loadData = async() => {
   try{
     const data = await roleService.getAll();
     setRoles(data.content || data);
   }catch(err){
     console.log(err);
   }
 };

 return(
  <div>
   <div className="page-container">

    <div className="table-card">

      <h1>All Roles</h1>

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

         {roles.map((item,index)=>(
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
