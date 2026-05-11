
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { projectService } from "../../services/projectService";

export default function ProjectFormPage(){
 const navigate = useNavigate();
 const { id } = useParams();
 const isEdit = Boolean(id);

 const [formData,setFormData] = useState({
   name:"",
   description:"",
   startDate:"",
   endDate:"",
   status:"ACTIVE"
 });

 useEffect(() => {
  if (!id) return;

  const loadProject = async () => {
    try {
      const project = await projectService.getById(id);
      setFormData({
        name: project.name || project.projectName || "",
        description: project.description || "",
        startDate: project.startDate ? String(project.startDate).slice(0, 10) : "",
        endDate: project.endDate ? String(project.endDate).slice(0, 10) : "",
        status: project.status || "ACTIVE"
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load project");
    }
  };

  loadProject();
 }, [id]);

 const handleChange = (e) => {
  setFormData({...formData,[e.target.name]:e.target.value});
 };

 const handleSubmit = async(e) => {
  e.preventDefault();
// project updating
  try{
    if (id) {
      await projectService.update(id, formData);
    } else {
      await projectService.create(formData);
    }
    alert(isEdit ? "Project Updated Successfully" : "Project Added Successfully");
    navigate("/projects");
  }catch(err){
    alert(isEdit ? "Failed to update project" : "Failed to add project");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>{isEdit ? "Edit Project" : "Add Project"}</h1>

      <form onSubmit={handleSubmit}>

       <div className="form-grid">
        <div className="form-field">
         <label htmlFor="projectName">Project Name *</label>
         <input id="projectName" name="name" value={formData.name} placeholder="Project Name" required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="projectDescription">Project Description *</label>
         <input id="projectDescription" name="description" value={formData.description} placeholder="Project Description" required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="startDate">Start Date *</label>
         <input id="startDate" type="date" name="startDate" value={formData.startDate} required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="endDate">End Date *</label>
         <input id="endDate" type="date" name="endDate" value={formData.endDate} required onChange={handleChange} />
        </div>

        <div className="form-field">
         <label htmlFor="projectStatus">Status</label>
         <select id="projectStatus" name="status" value={formData.status} onChange={handleChange}>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="PLANNED">PLANNED</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="ON_HOLD">ON_HOLD</option>
         </select>
        </div>

       </div>

       <div className="btn-group">
        <button type="button" className="secondary-btn" onClick={()=>navigate("/projects")}>Cancel</button>
        <button type="submit" className="primary-btn">{isEdit ? "Update Project" : "Create Project"}</button>
       </div>

      </form>

    </div>
   </div>
  </div>
 )
}
