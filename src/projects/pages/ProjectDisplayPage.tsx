
import { useEffect, useState } from "react";
import { projectService } from "../../services/projectService";

export default function ProjectDisplayPage(){

 const [projects, setProjects] = useState([]);

 useEffect(()=>{
   loadData();
 },[]);

 const loadData = async() => {
   try{
     const data = await projectService.getAll();
     setProjects(data.content || data);
   }catch(err){
     console.log(err);
   }
 };

 return(
  <div>
   <div className="page-container">

    <div className="table-card">

      <h1>All Projects</h1>

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

         {projects.map((item,index)=>(
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
