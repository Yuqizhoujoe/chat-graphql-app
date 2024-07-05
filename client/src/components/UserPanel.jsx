const UserPanel = ({ users }) => {
  if (!users || !users.length) return null;

  return (
    <div className="users-panel">
      {users.map((user) => (
        <div key={user.username} className="user-container">
          <div className="user-avatar-container">
            <img
              src={`http://localhost:8000${user.avatar}`}
              alt={user.username}
            />
          </div>
          <div className="username-container">
            <p className="username">{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPanel;
