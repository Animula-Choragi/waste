import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Badge, Row, Col } from 'react-bootstrap';
import { initContract } from '../utils/Web3Utils';

const PointRedemption = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [redeemService, setRedeemService] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const serviceOptions = [
    { 
      value: 'groceries', 
      label: 'Voucher Belanja', 
      description: 'Voucher untuk kebutuhan sehari-hari',
      minPoints: 100,
      icon: '🛒'
    },
    { 
      value: 'transport', 
      label: 'Potongan Transportasi', 
      description: 'Diskon biaya transportasi umum',
      minPoints: 75,
      icon: '🚌'
    },
    { 
      value: 'electricity', 
      label: 'Token Listrik', 
      description: 'Bantuan token listrik gratis',
      minPoints: 150,
      icon: '💡'
    },
    { 
      value: 'education', 
      label: 'Bantuan Pendidikan', 
      description: 'Beasiswa atau bantuan pendidikan',
      minPoints: 200,
      icon: '📚'
    }
  ];

  useEffect(() => {
    const initializeContract = async () => {
      try {
        const contractInstance = await initContract();
        setContract(contractInstance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        await fetchUserPoints(contractInstance, accounts[0]);
        setLoading(false);
      } catch (err) {
        setError('Gagal menginisialisasi: ' + err.message);
        setLoading(false);
      }
    };

    initializeContract();
  }, []);

  const fetchUserPoints = async (contractInstance, userAccount) => {
    try {
      const userDetails = await contractInstance.methods.getUserDetails().call({ from: userAccount });
      setUserPoints(parseInt(userDetails.totalPoints));
    } catch (err) {
      setError('Gagal mengambil poin: ' + err.message);
    }
  };

  const handlePointRedemption = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const pointsToRedeem = parseInt(redeemPoints);
    const selectedService = serviceOptions.find(service => service.value === redeemService);

    try {
      // Validasi poin
      if (pointsToRedeem > userPoints) {
        setError('Poin tidak mencukupi');
        return;
      }

      // Validasi minimal poin untuk layanan
      if (pointsToRedeem < selectedService.minPoints) {
        setError(`Minimal ${selectedService.minPoints} poin untuk layanan ini`);
        return;
      }

      await contract.methods.redeemPoints(
        pointsToRedeem, 
        redeemService
      ).send({ from: account });

      // Perbarui poin setelah menukar
      await fetchUserPoints(contract, account);

      alert(`Berhasil menukar ${pointsToRedeem} poin untuk ${selectedService.label}`);
      
      // Reset form
      setRedeemPoints('');
      setRedeemService('');
    } catch (err) {
      setError('Gagal menukar poin: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Memuat data...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center bg-success text-white">
          Tukar Poin
        </Card.Header>
        <Card.Body>
          <div className="text-center mb-4">
            <h4>Poin Anda</h4>
            <Badge bg="success" pill>
              {userPoints} Poin
            </Badge>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handlePointRedemption}>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Layanan</Form.Label>
              <Row>
                {serviceOptions.map((service) => (
                  <Col key={service.value} md={6} className="mb-2">
                    <Card 
                      className={`service-card ${redeemService === service.value ? 'selected' : ''}`}
                      onClick={() => setRedeemService(service.value)}
                    >
                      <Card.Body>
                        <div className="d-flex align-items-center">
                          <div className="me-3 display-4">{service.icon}</div>
                          <div>
                            <h5>{service.label}</h5>
                            <small>{service.description}</small>
                            <div className="mt-2">
                              <Badge bg="info">Min. {service.minPoints} poin</Badge>
                            </div>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Jumlah Poin yang Ditukar</Form.Label>
              <Form.Control 
                type="number" 
                placeholder="Masukkan jumlah poin" 
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                min="1"
                max={userPoints}
                required 
              />
            </Form.Group>

            <Button 
              variant="success" 
              type="submit" 
              className="w-100"
              disabled={!redeemService || !redeemPoints}
            >
              Tukar Poin
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Optional: Tambahkan CSS untuk kartu layanan */}
      <style jsx>{`
        .service-card {
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: scale(1.05);
        }
        .service-card.selected {
          border: 2px solid #28a745;
          background-color: #f0f0f0;
        }
      `}</style>
    </Container>
  );
};

export default PointRedemption;