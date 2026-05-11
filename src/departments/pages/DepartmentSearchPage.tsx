
import { useState } from "react";
import { departmentService } from "../../services/departmentService";

export default function DepartmentSearchPage(){

 const [id,setId] = useState("");
 const [department,setDepartment] = useState(null);

 const handleSearch = async() => {
  try{
   const data = await departmentService.getById(id);
   setDepartment(data.data || data);
  }catch(err){
   alert("Department not found");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>Search Department By ID</h1>

      <div className="search-box">

        <input
          placeholder="Enter Department ID"
          value={id}
          onChange={(e)=>setId(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSearch}>
          Search
        </button>

      </div>

      {department && (
        <div className="result-card">
          <h2>{department.name}</h2>
          <p>{department.description}</p>
        </div>
      )}

    </div>
   </div>
  </div>
 )
}
