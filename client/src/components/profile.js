import React from "react";
import {useState, useContext, useEffect} from 'react'
import axios from "axios";
import { UserContext } from "../App";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import { useParams } from "react-router-dom";
function Profile(props) {
  let  id  = props.id;
  let currUser = useContext(UserContext);
  const [profileUser, setProfileUser] =useState(null)
  const [value, setValue] = React.useState("1");
  const [item, setItem] = React.useState(null);
  const handleChange = (event, newValue) => {
    let tabs = document.querySelectorAll("[data-tab='tab']");
    tabs.forEach((tab) => {
      tab.style.backgroundColor = "white";
      tab.style.border = "1px solid black";
      // tab.style.borderRadius ='25px'
      //tab.style.margin='2px'
    });
    setValue(newValue);
    event.target.style.backgroundColor = "gray";
    event.target.style.border = "blue";
  };
  
  //------------------------------------------
  useEffect(() => {
    const getProfileUser =async () =>{
        let url = 'http://localhost:3001/api/users/user'
        try{
            let res = await axios.post( url,{
                userId:id
            })
            setProfileUser(res.data.user)
        }
        catch(error){
            console.log(error.msg)
        }
    }
    getProfileUser()
  },[])

  return (
    
   <div className='modal-fullscreen' >
    {
        profileUser === null ? 
        <div> NOW LOADING ............ 87%</div>
        :
    
  
   <div className="row  px-4 ">
      <div className="col-xl-10 col-md-11 col-sm-12 mx-auto">
        <div className="bg-white shadow rounded overflow-hidden">
          <div className="px-4 pt-0 pb-4 bg-dark">
            <button onClick={()=>{props.setIsProfileOpen(false)}}> Back</button>
            <div className="  profile-header mb-md-n5  row ">
              <div className="profile me-3 d-flex flex-column col-lg-3 col-md-4 col-sm-4 col-5">
                <img
                  src={profileUser.avatarURL}
                  alt="profile picture"
                  
                  className="rounded mb-2 img-thumbnail "
                />
               <div className="text-center">
                <h3 className="fw-bold text-capitalize">{profileUser.username}</h3>
               </div>
              </div>
              <div className="col-3 text-white d-flex justify-content-center align-items-center pb-2">
              
                </div>
              
            </div>
          </div>

          <div className="bg-light p-4 d-flex justify-content-end text-center ">
            <div>
          <a href="#" className="btn btn-dark btn-sm container btn-md-md btn-block my-2 " >
                Edit profile
              </a>
            <ul className="list-inline mb-0 " >
              <li className="list-inline-item me-5">
                <h5 className="font-weight-bold mb-0 d-block">241</h5>
                <small className="text-muted">
                  {" "}
                  <i className="fa fa-picture-o mr-1"></i>Photos
                </small>
              </li>
              <li className="list-inline-item">
                <h5 className="font-weight-bold mb-0 d-block">84K</h5>
                <small className="text-muted">
                  {" "}
                  <i className="fa fa-user-circle-o mr-1"></i>Followers
                </small>
              </li >
              <li className="list-inline-item ">
              
              </li>
            </ul>
            </div>
          </div>

          <div class="py-4 px-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="mb-0">Recent photos</h5>
              <a href="#" class="btn btn-link text-muted">
                Show all
              </a>
            </div>
            <div class="row">
              <div class="col-lg-6 mb-2 pe-lg-1">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-profile/img-3.jpg"
                  alt=""
                  class="img-fluid rounded shadow-sm"
                />
              </div>
              <div class="col-lg-6 mb-2 ps-lg-1">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-profile/img-4.jpg"
                  alt=""
                  class="img-fluid rounded shadow-sm"
                />
              </div>
              <div class="col-lg-6 pe-lg-1 mb-2">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-profile/img-5.jpg"
                  alt=""
                  class="img-fluid rounded shadow-sm"
                />
              </div>
              <div class="col-lg-6 ps-lg-1">
                <img
                  src="https://bootstrapious.com/i/snippets/sn-profile/img-6.jpg"
                  alt=""
                  class="img-fluid rounded shadow-sm"
                />
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>

    }
    </div>
  
  );
}

export default Profile;
