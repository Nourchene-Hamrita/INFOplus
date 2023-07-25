import React from 'react';
import RootStack from './navigators/RootStack';
import{  AuthProvider } from './context/AuthContext';
 
export default function App() {
  
  return (
  
    <AuthProvider >
      <RootStack />
    </AuthProvider>
  );
}


