import React, { createContext, useContext, useState } from 'react';

const ProfilePictureContext = createContext();

export function useProfilePicture() {
  return useContext(ProfilePictureContext);
}

export function ProfilePictureProvider({ children }) {
  const [profilePicture, setProfilePicture] = useState(null);

  return (
    <ProfilePictureContext.Provider value={{ profilePicture, setProfilePicture }}>
      {children}
    </ProfilePictureContext.Provider>
  );
}