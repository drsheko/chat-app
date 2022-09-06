import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { toast } from "react-toastify";
import { UserContext } from "../App";
const Header = ({ setUser }) => {
  let navigate = useNavigate();

  var user = useContext(UserContext);
  useEffect(() => {
    setUser(user);
  }, [user]);
  // logout
  const logout = async() => {
    try{
        var res = await fetch("http://localhost:3001/api/logout")
        setUser(null);
        localStorage.clear();
        navigate("/");
    // toast.success("You logged out successfully");
    }
    catch{

    }
    
  };
  return (
    <>
      <nav className="navbar sticky-top navbar-light bg-light ">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Chat 
          </a>
         
          <div>
            {user === null ? (
              <i className="bi bi-person-circle  btn">
                <a href="/login">Sign in</a>
              </i>
            ) : (
              <i className="bi bi-person-circle  btn" onClick={logout}>
                {" "}
                <span className="text-primary"> Logout</span>
              </i>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
