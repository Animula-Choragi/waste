import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { initContract } from '../utils/Web3Utils';
import logo from './logo.png'

const CustomNavbar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const contractInstance = await initContract();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userDetails = await contractInstance.methods.getUserDetails().call({ from: accounts[0] });
        
        setUserName(userDetails.name);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <Navbar bg="success" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/collect" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Bank Sampah Logo"
            style={{
              height: '40px',
              marginRight: '10px',
            }} 
            className="d-inline-block align-top me-2"
          />
          ETH Bank Sampah
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav>
            <Nav.Link as={Link} to="/collect" className="mx-2">Kumpulkan Sampah</Nav.Link>
            <Nav.Link as={Link} to="/redeem" className="mx-2">Tukar Poin</Nav.Link>
            <Nav.Link as={Link} to="/redemption-history" className="mx-2">Riwayat Penukaran</Nav.Link>
          </Nav>
        </Navbar.Collapse>
        
        <Navbar.Text className="text-white">
          Selamat datang, {userName}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;