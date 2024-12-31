import Web3 from 'web3';
import BankSampahContract from '../contracts/BankSampahContract.json';

// Fungsi untuk mendapatkan instance Web3
export const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request akses akun
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return web3;
    } catch (error) {
      console.error("Akses akun ditolak");
      throw error;
    }
  } else if (window.web3) {
    // Untuk browser lama dengan web3 yang sudah terinstall
    return new Web3(window.web3.currentProvider);
  } else {
    console.log('Browser non-Ethereum terdeteksi. Pertimbangkan untuk menggunakan MetaMask!');
    throw new Error('Web3 tidak tersedia');
  }
};

// Fungsi untuk menginisialisasi kontrak
export const initContract = async () => {
  try {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    
    // Dapatkan alamat kontrak dari jaringan yang sedang aktif
    const deployedNetwork = BankSampahContract.networks[networkId];
    
    if (!deployedNetwork) {
      throw new Error('Kontrak tidak di-deploy di jaringan ini');
    }

    // Buat instance kontrak
    return new web3.eth.Contract(
      BankSampahContract.abi,
      deployedNetwork.address
    );
  } catch (error) {
    console.error('Gagal menginisialisasi kontrak:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan akun aktif
export const getActiveAccount = async () => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } catch (error) {
    console.error('Gagal mendapatkan akun:', error);
    throw error;
  }
};