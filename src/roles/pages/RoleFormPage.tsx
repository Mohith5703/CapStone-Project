
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { roleService } from "../../services/roleService";

export default function RoleFormPage(){
 const navigate = useNavigate();
 const { id } = useParams();
 const isEdit = Boolean(id);

 const [formData,setFormData] = useState({
   name:"",
   description:"",
   level:1
 });

 useEffect(() => {
  if (!id) return;

  const loadRole = async () => {
    try {
      const role = await roleService.getById(id);
      setFormData({
        name: role.name || role.roleName || "",
        description: role.description || "",
        level: role.level || role.seniorityLevel || 1
      });
    } catch (err) {
      console.log(err);
      alert("Failed to load role");
    }
  };

  loadRole();
 }, [id]);

 const handleChange = (e) => {
  setFormData({...formData,[e.target.name]:e.target.value});
 };

 const handleSubmit = async(e) => {
  e.preventDefault();

  try{
    const payload = {
      ...formData,
      level:Number(formData.level)
    };

    if (id) {
      await roleService.update(id, payload);
    } else {
      await roleService.create(payload);
    }

    alert(isEdit ? "Role Updated Successfully" : "Role Added Successfully");
    navigate("/roles");

  }catch(err){
    alert(isEdit ? "Failed to update role" : "Failed to add role");
  }
 };

 return(
  <div>
   <div className="page-container">
    <div className="form-card">

      <h1>{isEdit ? "Edit Role" : "Add Role"}</h1>

      <form onSubmit={handleSubmit}>

       <div className="form-grid">
        <div className="form-field">
         <label htmlFor="roleName">Role Name *</label>
         <input id="roleName" name="name" value={formData.name} placeholder="Role Name" required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="roleDescription">Role Description *</label>
         <input id="roleDescription" name="description" value={formData.description} placeholder="Role Description" required onChange={handleChange} />
        </div>
        <div className="form-field">
         <label htmlFor="level">Level *</label>
         <input id="level" name="level" value={formData.level} type="number" placeholder="Level" required onChange={handleChange} />
        </div>
       </div>

       <div className="btn-group">
        <button type="button" className="secondary-btn" onClick={()=>navigate("/roles")}>Cancel</button>
        <button type="submit" className="primary-btn">{isEdit ? "Update Role" : "Create Role"}</button>
       </div>

      </form>

    </div>
   </div>
  </div>
 )
}
