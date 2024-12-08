import { initContract } from './Web3Utils';

// Fungsi untuk mendapatkan detail pengguna
export const getUserDetails = async (account) => {
  try {
    const contract = await initContract();
    return await contract.methods.getUserDetails().call({ from: account });
  } catch (error) {
    console.error('Gagal mendapatkan detail pengguna:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan riwayat transaksi pengguna
export const getUserTransactions = async (account) => {
  try {
    const contract = await initContract();
    return await contract.methods.getUserTransactions().call({ from: account });
  } catch (error) {
    console.error('Gagal mendapatkan riwayat transaksi:', error);
    throw error;
  }
};

// Fungsi untuk menghitung total poin yang dimiliki
export const calculateTotalPoints = (transactions) => {
  return transactions.reduce((total, transaction) => {
    return total + transaction.pointsEarned;
  }, 0);
};

// Fungsi untuk mengelompokkan transaksi berdasarkan jenis sampah
export const groupTransactionsByWasteType = (transactions) => {
  const groups = {
    ORGANIC: [],
    PLASTIC: [],
    PAPER: [],
    METAL: [],
    ELECTRONIC: []
  };

  transactions.forEach(transaction => {
    const wasteTypeKey = Object.keys(groups)[transaction.wasteType];
    groups[wasteTypeKey].push(transaction);
  });

  return groups;
};

// Fungsi untuk mendapatkan statistik pengumpulan sampah
export const getWasteCollectionStats = (transactions) => {
  const stats = {
    totalWeight: 0,
    totalPoints: 0,
    transactionCount: transactions.length
  };

  transactions.forEach(transaction => {
    stats.totalWeight += transaction.weight;
    stats.totalPoints += transaction.pointsEarned;
  });

  return stats;
};