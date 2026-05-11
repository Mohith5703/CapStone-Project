
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { departmentService } from "../../services/departmentService";

export default function DepartmentFormPage(){
 const navigate = useNavigate();
 const { id } = useParams();
 const isEdit = Boolean(id);

 const [formData,setFormData] = useState({
   name:"",
   description:""
 });

 useEffect(() => {
  if (!id) return;

  const loadDepartment = async () => {
    try {
      const department = await departmentService.getById(id);
      setFormData({
        name: department.name || department.departmentName || "",
        description: department.description || ""
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load department");
    }
  };

  loadDepartment();
 }, [id]);

 const handleChange = (e) => {
  setFormData({...formData,[e.target.name]:e.target.value});
 };

 const handleSubmit = async(e) => {
  e.preventDefault();

  try{
    if (id) {
      await departmentService.update(id, formData);
    } else {
      await departmentService.create(formData);
    }
    alert(isEdit ? "Department Updated Successfully" : "Department Added Successfully");
    navigate("/departments");
  }catch(err){
    alert(isEdit ? "Failed to update department" : "Failed to add department");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>{isEdit ? "Edit Department" : "Add Department"}</h1>

      <form onSubmit={handleSubmit}>

       <div className="form-grid">
        <div className="form-field">
         <label htmlFor="departmentName">Department Name *</label>
         <input id="departmentName" name="name" value={formData.name} placeholder="Department Name" required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="departmentDescription">Department Description *</label>
         <input id="departmentDescription" name="description" value={formData.description} placeholder="Department Description" required onChange={handleChange} />
        </div>
       </div>

       <div className="btn-group">
        <button type="button" className="secondary-btn" onClick={()=>navigate("/departments")}>Cancel</button>
        <button type="submit" className="primary-btn">{isEdit ? "Update Department" : "Create Department"}</button>
       </div>

      </form>

    </div>
   </div>
  </div>
 )
}
