import React, { useEffect, useState } from "react";
import avatar from "../assests/avatar.png";
import axios from "axios";
import { useLocalStorageVariableContext } from "../utils/storage/LocalStorage";
import { useToastProviderContext } from "../utils/toast/Toast";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
  const { usernameToken } = useLocalStorageVariableContext();
  const setToast = useToastProviderContext();

  useEffect(() => {
    if (usernameToken){
        axios
        .get("http://127.0.0.1:8080/profile", {
          headers: {
            Authorization: "Bearer " + usernameToken,
          },
        })
        .then((res) => {
          setUserDetails(res.data)
        })
        .catch((err) => {
          console.error(err);
          setToast({
            severity: "error",
            title: "Profile Load",
            description: `Could not load profile`,
          });
        });
    }
    
  }, [usernameToken]);

  return (
    <>
      <div className="profile-page-header">
        <div className="container">
          <h2>User Details</h2>
        </div>
      </div>
      <div className="container profile-page-container">
        <div className="profile-card">
          <div className="profile-card-holder">Profile</div>
          <div className="profile-card-body">
            <div className="user-pic-container">
              <img src={avatar} alt="" />
            </div>
            <div className="profile-details">
              <div className="detail">
                <div className="detail-title">Name</div>
                <div className="detail-info">{userDetails.username}</div>
              </div>
              <div className="detail">
                <div className="detail-title"># of Favorites</div>
                <div className="detail-info">{userDetails.favoritesCount}</div>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
