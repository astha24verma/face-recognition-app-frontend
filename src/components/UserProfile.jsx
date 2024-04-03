import React from 'react';

const UserProfile = ({ user }) => {
  return (
    <div>
      <h2>User Profile</h2>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          {/* Display other user information */}
        </div>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
};

export default UserProfile;