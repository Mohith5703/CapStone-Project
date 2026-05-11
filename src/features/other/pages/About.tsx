// About.tsx

import {  useRef,useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { saveData } from "../../../store/AboutSlice";

const About = () => {

    const dispatch = useDispatch();

    const data= useSelector((state:{about:{username:"",password:""}})=>state.about)

    const [input, setInput] = useState({ username: "", password: "" });
    const [output, setOutput] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    // // uncontrolled form - 1 - declare fields using useRef
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    const usernameValidator = (user: string): string => {
        if (!user) {
            return "Username is required.";
        } 
        else if (user.length < 4) {
            return "Username must be minimum 4 characters long.";
        } 
        else if (user.length > 20) {
            return "Username must be maximum 20 characters long.";
        } 
        else {
            return "";
        }
    };

    

    const passwordValidator = (pass: string): string => {
        if (!pass) {
            return "Password is required.";
        } 
        else if (pass.length < 4) {
            return "Password must be minimum 4 characters long.";
        } 
        else if (pass.length > 20) {
            return "Password must be maximum 20 characters long.";
        } 
        else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#*$]).*/.test(pass)) {
            return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
        } 
        else {
            return "";
        }
    };

    const inputValidator = (data: { username: string; password: string }) => {
    console.log("inputValidator", data);

    const usernameError = usernameValidator(data.username);
    const passwordError = passwordValidator(data.password);

    if (usernameError) {
        setError(usernameError);
        return false;
    }

    if (passwordError) {
        setError(passwordError);
        return false;
    }

    setError("");
    return true;
};

//     const handleInput = (evt: any) => {
//     const { name, value } = evt.target;

//     setInput({...input,[name]: value});
//     if (error) {
//         setError("");
//     }
// };

const handleSubmit = (evt: any) => {
    evt.preventDefault();

    // // Uncontrolled form - 3- extract values into component
    const input={
        username: usernameRef.current!.value,
        password: passwordRef.current!.value
    };

    if (inputValidator(input)) {
        setOutput(input);
        console.log("Form submitted:", input);
        setInput({username: "",password: ""});
        dispatch(saveData(input))
        setError("");
    } else {
        console.error("Invalid inputs!");
    }
};

    return (
        <>
            <h2>About Component</h2>
            <p>Forms in ReactJS</p>
            <hr />
            <>
                <form onSubmit={handleSubmit}>
                    {/* //// uncontrolled form -2- capture user inputs */}
                    <input
                        type="text" name="username" ref={usernameRef} autoFocus 
                    />
                    <br />
                    <input
                        type="password" name="password" ref={passwordRef}
                    />
                    <br />
                    <input type="submit" value="Submit" />
                </form>
            </>
            {/* <p>validation for username:min len,max len,no special case</p>
            <p>validation for password:min len,max len,atleast one upper,one lower,one special case</p> */}
            <p>{(error)&&error}</p>
            <p>Input: - {input.username}  - {input.password}</p>
            <p>Output: - {output.username} - {output.password}</p>
            <h3>Data from redux store</h3>
            <p>Username:{data.username}</p>
            <p>Password:{data.password}</p>

            
        </>
    );
}

export default About;
// // About.tsx

// import { useState } from "react";

// const About = () => {
//     const [input, setInput] = useState({ username: "", password: "" });
//     const [output, setOutput] = useState({ username: "", password: "" });
//     const [error, setError] = useState("");

//     const usernameValidator = (user: string): string => {
//         if (!user) {
//             return "Username is required.";
//         } 
//         else if (user.length < 4) {
//             return "Username must be minimum 4 characters long.";
//         } 
//         else if (user.length > 20) {
//             return "Username must be maximum 20 characters long.";
//         } 
//         else {
//             return "";
//         }
//     };

//     const passwordValidator = (pass: string): string => {
//         if (!pass) {
//             return "Password is required.";
//         } 
//         else if (pass.length < 4) {
//             return "Password must be minimum 4 characters long.";
//         } 
//         else if (pass.length > 20) {
//             return "Password must be maximum 20 characters long.";
//         } 
//         else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#*$]).*/.test(pass)) {
//             return "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.";
//         } 
//         else {
//             return "";
//         }
//     };

//     const inputValidator = (data: { username: string; password: string }) => {
//     console.log("inputValidator", data);

//     const usernameError = usernameValidator(data.username);
//     const passwordError = passwordValidator(data.password);

//     if (usernameError) {
//         setError(usernameError);
//         return false;
//     }

//     if (passwordError) {
//         setError(passwordError);
//         return false;
//     }

//     setError("");
//     return true;
// };

//     const handleInput = (evt: any) => {
//     const { name, value } = evt.target;

//     setInput({...input,[name]: value});
//     if (error) {
//         setError("");
//     }
// };

// const handleSubmit = (evt: any) => {
//     evt.preventDefault();

//     if (inputValidator(input)) {
//         setOutput(input);
//         console.log("Form submitted:", input);
//         setInput({username: "",password: ""});
//         setError("");
//     } else {
//         console.error("Invalid inputs!");
//     }
// };

//     return (
//         <>
//             <h2>About Component</h2>
//             <p>Forms in ReactJS</p>
//             <hr />
//             <>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text" name="username" value={input.username} onChange={handleInput} autoFocus 
//                     />
//                     <br />
//                     <input
//                         type="password" name="password"value={input.password} onChange={handleInput} 
//                     />
//                     <br />
//                     <input type="submit" value="Submit" />
//                 </form>
//             </>
//             {/* <p>validation for username:min len,max len,no special case</p>
//             <p>validation for password:min len,max len,atleast one upper,one lower,one special case</p> */}
//             <p>{(error)&&error}</p>
//             <p>Input: - {input.username}  - {input.password}</p>
//             <p>Ouput: - {output.username} - {output.password}</p>
            
            
//         </>
//     );
// }

// export default About;

// // About.tsx

// import { useState } from "react";

// const About = () => {
//     const [input, setInput] = useState({ username: "", password: "" });
//     const [output, setOutput] = useState({ username: "", password: "" });

//     const handleInput = (evt) => {
//         console.log(evt.target);
//         const { name, value } = evt.target;
//         setInput({ ...input, [name]: value });
//     };

//     const handleSubmit = (evt) => {
//         evt.preventDefault();
//         setOutput(input); // call rest apis 
//         console.log("Form submitted:", input);
//         setInput({ username: "", password: "" });
//     };

//     return (
//         <>
//             <h2>About Component</h2>
//             <p>Forms in ReactJS</p>
//             <hr />
//             <>
//                 <form onSubmit={handleSubmit}>
//                     <input
//                         type="text"
//                         name="username"
//                         value={input.username}
//                         onChange={handleInput}
//                         autoFocus required
//                     />
//                     <br />
//                     <input
//                         type="password"
//                         name="password"
//                         value={input.password}
//                         onChange={handleInput} required
//                     />
//                     <br />
//                     <input type="submit" value="Submit" />
//                 </form>
//             </>
//             {/* <p>Input: - {input.username}  - {input.password}</p>
//             <p>Ouput: - {output.username} - {output.password}</p> */}
//             <p>Conditional Rendering</p>
//             {(input.username)&& <p>Input: - {input.username}</p>}
//             {(input.password) ? <p>Input: - {input.username}</p> : <p>Output: - {output.username}</p>}
            
//         </>
//     );
// }

// export default About;