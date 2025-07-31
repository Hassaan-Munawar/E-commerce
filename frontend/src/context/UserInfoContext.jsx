import { createContext, useState } from 'react';

export const UserInfoContext = createContext();

export default function UserInfoProvider({ children }) {
  const [userInfo, setUserInfo] = useState(false);

  return (
    <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
}