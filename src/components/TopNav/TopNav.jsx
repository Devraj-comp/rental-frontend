import React, { useEffect } from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import profileImg from "../../assets/images/man1.jpeg";
import "./top-nav.css";
import { FaBell } from "react-icons/fa";

const TopNav = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadcount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const navigate = useNavigate();

  // function to toggle the notification dropdown
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const access = localStorage.getItem('access_token');
  // fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async() => {
      try{
        const response = await fetch('https://rental-backend-4zh6.onrender.com/notification/notifications/',{
          method: 'GET',
          headers: {
            'Authorization': `JWT ${access}`,
            'content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Failed to fetch notifications.');

        const data = await response.json();
        setNotifications(data);
        const unread = data.filter((notif) => !notif.is_read).length;
        setUnreadcount(unread);
      } catch(error){
        console.error("Error fetching notifications", error);
      }
    };
    fetchNotifications();
  }, []);

  // include the mark notification 
  const markNotificationAsRead = async(notificationId) => {
    try{
      await fetch(`https://rental-backend-4zh6.onrender.com/notification/notifications/${notificationId}/read`,{
        method: 'PATCH',
        headers: {
          'Authorization': `JWT ${access}`,
          'content-Type': 'application/json',
        }
      });
    } catch (error){
      console.log('Failed to mark notification as read: ', error);
    }
  };
  // handle notification click
  const handleNotificationClick = async (notification) => {
    try{
      // mark the notification as read
      await markNotificationAsRead(notification.id);

      // update the local state to mark it as read
      setNotifications((prev) =>
        prev.map((notif) => 
          notif.id === notification.id?{...notif, is_read: true} :notif
        )
      );
      setUnreadcount((prev) => Math.max(prev - 1, 0));
  
      // navigate to the booking orders table
      console.log('notification message: ', notification.message);

      if(notification.message.toLowerCase().includes('service')){
        navigate("/service-bookings")
      } else if (notification.message.toLowerCase().includes('tour')) {
        navigate("/tourPackage-bookings");
      } else {
        navigate("/bookings");
      }
    } catch (error){
      console.log('Error handling notification click:', error);
    }
  };

  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        <div className="search__box">
          <input type="text" placeholder="search or type" />
          <span>
            <i class="ri-search-line"></i>
          </span>
        </div>
        <div className="top__nav-right">
          <span className="notification">
            <i class="ri-notification-3-line"></i>
            {/* <span onClick = {toggleDropdown} className="h-2 w-2 badge">{unreadCount}</span> */}
            <FaBell
              style={{
                color: "white",
                height: "25px",
                width: "25px",
                marginLeft: "8px",
                cursor: "pointer",
              }}
              onClick={toggleDropdown}
            />
            {/* Unread notifications badge */}
            {unreadCount > 0 && (
              <span
              onClick={toggleDropdown}
              style={{
                position: "absolute",
                top: "-5px", // Adjust for proper positioning
                right: "-10px", // Adjust for proper positioning
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                width: "16px", // Smaller size
                height: "16px", // Smaller size
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px", // Smaller font size
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </span>
            )}
          </span>
          <div className="profile">
            <Link to="/settings">
              <img src={profileImg} alt="" />
            </Link>
          </div>
        </div>
      </div>
      {/* notification dropdown */}
      {showDropdown && (
        <div className="notifications-dropdown">
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={!notif.is_read ? "unread" : ""}
                  onClick={() => handleNotificationClick(notif)}
                >
                  {notif.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications</p>
          )}
        </div>
      )}
      
    </div>
  );
};

export default TopNav;
