
import { useState } from "react";
import { projectService } from "../../services/projectService";

export default function ProjectSearchPage(){

 const [id,setId] = useState("");
 const [project,setProject] = useState(null);

 const handleSearch = async() => {
  try{
   const data = await projectService.getById(id);
   setProject(data.data || data);
  }catch(err){
   alert("Project not found");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>Search Project By ID</h1>

      <div className="search-box">

        <input
          placeholder="Enter Project ID"
          value={id}
          onChange={(e)=>setId(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSearch}>
          Search
        </button>

      </div>

      {project && (
        <div className="result-card">
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <p>{project.status}</p>
        </div>
      )}

    </div>
   </div>
  </div>
 )
}
