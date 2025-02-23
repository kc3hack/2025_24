import React, { createContext, useState, useContext } from 'react';

// Contextの作成
const UserContext = createContext();

// ユーザー情報を提供するプロバイダ
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);

  const setUser = (data) => {
    setUserId(data);
  };

  return (
    <UserContext.Provider value={{ userId, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// ユーザー情報を取得するカスタムフック
export const useUser = () => {
  return useContext(UserContext);
};