
import { useState } from "react";
import { roleService } from "../../services/roleService";

export default function RoleSearchPage(){

 const [id,setId] = useState("");
 const [role,setRole] = useState(null);

 const handleSearch = async() => {
  try{
   const data = await roleService.getById(id);
   setRole(data.data || data);
  }catch(err){
   alert("Role not found");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>Search Role By ID</h1>

      <div className="search-box">

        <input
          placeholder="Enter Role ID"
          value={id}
          onChange={(e)=>setId(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSearch}>
          Search
        </button>

      </div>

      {role && (
        <div className="result-card">
          <h2>{role.name}</h2>
          <p>{role.description}</p>
          <p>Level: {role.level}</p>
        </div>
      )}

    </div>
   </div>
  </div>
 )
}
