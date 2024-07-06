import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import axios from "../apis/axios";

import "../styles/RoomEntry.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../state/actions";

const RoomEntry = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // create user
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // User Reducer
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.user);

  // search users
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);

  // debounce
  const [oldTimeout, setTime] = useState(null);
  const debounce = (fn, delay) => {
    return (...args) => {
      clearTimeout(oldTimeout);
      const newTimeout = setTimeout(() => {
        return fn.apply(this, args);
      }, delay);
      setTime(newTimeout);
    };
  };

  useEffect(() => {
    const searchUsers = async () => {
      try {
        const response = await axios.get(`/users/search-users?q=${query}`);
        setUsers(response.data || []);
      } catch (error) {
        console.error("Error Searching users: ", error);
      }
    };

    const debounceSearchUsers = debounce(searchUsers, 300);

    if (query) {
      debounceSearchUsers();
    } else {
      setUsers([]);
    }

    return () => {
      setUsers([]);
    };
  }, [query]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // create a new user
    const formData = new FormData();
    formData.append("username", username);
    formData.append("avatar", avatar);

    const response = await axios.post("/users/create-user", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const user = response.data || {};
    dispatch(setUser(user));

    navigate(`/chat-room/${roomId}`, { state: { username: user.username } });
  };

  const handleUserSelect = (selectedUser) => {
    dispatch(setUser(selectedUser));
    navigate(`/chat-room/${roomId}`, {
      state: { username: selectedUser.username },
    });
  };

  const renderCreateUserForm = () => {
    return (
      <form className="room-entry-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="avatar">Avatar:</label>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                className="avatar-preview"
              />
            ) : (
              <p>
                Drag 'n' drop your avatar image here, or click to select one
              </p>
            )}
          </div>
        </div>
        <button type="submit" className="submit-button">
          Enter Room
        </button>
      </form>
    );
  };

  const renderUsersResult = () => {
    if (!users || !users.length) return null;
    return users.map((user) => {
      return (
        <div
          key={user.username}
          className="search-result"
          onClick={() => handleUserSelect(user)}
        >
          <img
            className="search-result-image"
            src={`http://127.0.0.1:8000${user.avatar}`}
            alt={`${user.username} User Avatar`}
          />
          <p className="search-result-username">{user.username}</p>
        </div>
      );
    });
  };

  const renderSearchForm = () => {
    return (
      <div className="room-entry-search-form">
        <div className="search-box-container">
          <input
            type="text"
            name="search"
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="search-results">{renderUsersResult()}</div>
      </div>
    );
  };

  return (
    <div className="room-entry-container">
      {renderSearchForm()}
      {renderCreateUserForm()}
    </div>
  );
};

export default RoomEntry;
