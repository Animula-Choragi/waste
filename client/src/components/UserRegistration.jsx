import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { initContract } from '../utils/Web3Utils';

const UserRegistration = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [domicile, setDomicile] = useState('');
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const init = async () => {
      try {
        const contractInstance = await initContract();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        setContract(contractInstance);
        setAccount(accounts[0]);
      } catch (err) {
        setError('Gagal menginisialisasi kontrak: ' + err.message);
      }
    };

    init();
  }, []);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      await contract.methods.registerUser(name, domicile).send({ from: account });
      window.location.reload(); // Force page reload to trigger registration check
    } catch (err) {
      setError('Registrasi gagal: ' + err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <Card className="shadow-sm" style={{width: '400px'}}>
        <Card.Header as="h2" className="text-center bg-success text-white">
          Registrasi Nasabah ETH Bank Sampah
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleRegistration}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Masukkan nama lengkap" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Domisili</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Masukkan alamat domisili" 
                value={domicile}
                onChange={(e) => setDomicile(e.target.value)}
                required 
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Daftar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserRegistration;