
const API_BASE = "http://localhost:8080/api/v1";

export const apiRequest = async(endpoint, method="GET", body=null) => {

  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}${endpoint}`,{
    method,
    headers:{
      "Content-Type":"application/json",
      "Authorization": `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : null
  });

  if(!response.ok){
    const text = await response.text();
    throw new Error(text || "API Failed");
  }

  if(method === "DELETE"){
    return true;
  }

  return await response.json();
};
