
import { useState } from "react";
import { employeeService } from "../../services/employeeService";

export default function EmployeeSearchPage(){

 const [id,setId] = useState("");
 const [employee,setEmployee] = useState(null);
 const [error,setError] = useState("");

 const handleSearch = async() => {

   try{

     setError("");

     const data = await employeeService.getById(id);

     setEmployee(data.data || data);

   }catch(err){

     setEmployee(null);
     setError("Employee not found");

   }
 };

 return(
  <div>

   <div className="page-container">

    <div className="form-card">

      <h1>Search Employee By ID</h1>

      <div className="search-box">

        <input
          value={id}
          onChange={(e)=>setId(e.target.value)}
          placeholder="Enter Employee ID"
        />

        <button className="primary-btn" onClick={handleSearch}>
          Search
        </button>

      </div>

      {error && <p>{error}</p>}

      {employee && (
        <div className="result-card">

          <h2>{employee.firstName} {employee.lastName}</h2>

          <p>Email: {employee.email}</p>
          <p>Status: {employee.status}</p>
          <p>Phone: {employee.phone}</p>

        </div>
      )}

    </div>

   </div>

  </div>
 )
}
