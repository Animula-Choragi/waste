import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Spinner } from 'react-bootstrap';
import { initContract } from '../utils/Web3Utils';

const PointRedemptionHistory = () => {
  // const [userName, setUserName] = useState('');
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const serviceMap = {
    'groceries': { label: 'Voucher Belanja', icon: '🛒' },
    'transport': { label: 'Potongan Transportasi', icon: '🚌' },
    'electricity': { label: 'Token Listrik', icon: '💡' },
    'education': { label: 'Bantuan Pendidikan', icon: '📚' }
  };

  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      try {
        const contractInstance = await initContract();

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const activeAccount = accounts[0];

        // const userDetails = await contractInstance.methods.getUserDetails().call({ from: activeAccount });
        // setUserName(userDetails.name);

        const redemptionTransactions = await contractInstance.methods.getPointRedemptionHistory().call({ from: activeAccount });
        
        const formattedHistory = redemptionTransactions.map(transaction => ({
          ...transaction,
          pointsRedeemed: Number(transaction.pointsRedeemed),
          timestamp: Number(transaction.timestamp)
        }));

        setRedemptionHistory(formattedHistory);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat riwayat penukaran poin: ' + err.message);
        setLoading(false);
      }
    };

    fetchRedemptionHistory();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p>Memuat riwayat penukaran poin...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center bg-success text-white">
          Riwayat Penukaran Poin
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            {/* <h4>{userName}</h4> */}
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {redemptionHistory.length === 0 ? (
            <Alert variant="info" className="text-center">
              Belum ada riwayat penukaran poin
            </Alert>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Layanan</th>
                  <th>Poin Ditukar</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {redemptionHistory.map((redemption, index) => {
                  const serviceInfo = serviceMap[redemption.service] || { 
                    label: 'Layanan Tidak Dikenal', 
                    icon: '❓' 
                  };

                  return (
                    <tr key={index}>
                      <td>
                        {serviceInfo.icon} {serviceInfo.label}
                      </td>
                      <td>{redemption.pointsRedeemed} Poin</td>
                      <td>
                        {new Date(redemption.timestamp * 1000).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PointRedemptionHistory;