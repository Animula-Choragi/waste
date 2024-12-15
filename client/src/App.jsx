import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { initContract } from './utils/Web3Utils';
import CustomNavbar from './components/CustomNavbar';
import UserRegistration from './components/UserRegistration';
import WasteCollection from './components/WasteCollection';
import PointRedemption from './components/PointRedemption';
import PointRedemptionHistory from './components/PointRedemptionHistory';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const contractInstance = await initContract();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userDetails = await contractInstance.methods.getUserDetails().call({ from: accounts[0] });
        
        setIsRegistered(userDetails.isRegistered);
      } catch (error) {
        console.error('Error checking registration:', error);
        setIsRegistered(false);
      }
    };

    checkRegistration();
  }, []);

  return (
    <Router>
      <div className="App">
        {isRegistered && <CustomNavbar />}
        
        <Container className="mt-4">
          <Routes>
            <Route 
              path="/" 
              element={isRegistered ? <Navigate to="/collect" /> : <UserRegistration />} 
            />
            <Route path="/collect" element={isRegistered ? <WasteCollection /> : <Navigate to="/" />} />
            <Route path="/redeem" element={isRegistered ? <PointRedemption /> : <Navigate to="/" />} />
            <Route path="/redemption-history" element={isRegistered ? <PointRedemptionHistory /> : <Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;