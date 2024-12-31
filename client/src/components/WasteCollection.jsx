import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Badge } from 'react-bootstrap';
import { initContract } from '../utils/Web3Utils';

const WasteCollection = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [weight, setWeight] = useState('');
  const [wasteType, setWasteType] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [error, setError] = useState(null);

  const wasteTypeOptions = [
    { value: '0', label: 'Organik', variant: 'success' },
    { value: '1', label: 'Plastik', variant: 'primary' },
    { value: '2', label: 'Kertas', variant: 'info' },
    { value: '3', label: 'Logam', variant: 'secondary' },
    { value: '4', label: 'Elektronik', variant: 'warning' }
  ];

  useEffect(() => {
    const init = async () => {
      try {
        const contractInstance = await initContract();
        setContract(contractInstance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        await fetchUserPoints(contractInstance, accounts[0]);
      } catch (err) {
        setError('Gagal menginisialisasi: ' + err.message);
      }
    };

    init();
  }, []);

  const fetchUserPoints = async (contractInstance, userAccount) => {
    try {
      const userDetails = await contractInstance.methods.getUserDetails().call({ from: userAccount });
      setUserPoints(parseInt(userDetails.totalPoints));
    } catch (err) {
      setError('Gagal mengambil poin: ' + err.message);
    }
  };

  const handleWasteCollection = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await contract.methods.collectWaste(
        parseInt(wasteType), 
        parseInt(weight)
      ).send({ from: account });

      // Perbarui poin setelah mengumpulkan sampah
      await fetchUserPoints(contract, account);

      alert('Sampah berhasil dikumpulkan!');
      // Reset form
      setWeight('');
      setWasteType('');
    } catch (err) {
      setError('Gagal mengumpulkan sampah: ' + err.message);
    }
  };

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center bg-success text-white">
          Kumpulkan Sampah
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <h4>Poin Anda</h4>
            <Badge bg="success" pill>
              {userPoints} Poin
            </Badge>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleWasteCollection}>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Sampah</Form.Label>
              <Form.Select 
                value={wasteType} 
                onChange={(e) => setWasteType(e.target.value)}
                required
              >
                <option value="">Pilih Jenis Sampah</option>
                {wasteTypeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Berat Sampah (kg)</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Masukkan berat sampah" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required 
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Kumpulkan Sampah
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default WasteCollection;