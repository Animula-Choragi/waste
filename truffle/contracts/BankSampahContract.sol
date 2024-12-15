// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BankSampahContract {
    // Enum untuk kategori sampah
    enum WasteType { ORGANIC, PLASTIC, PAPER, METAL, ELECTRONIC }

    // Struktur data pengguna
    struct User {
        address userAddress;
        string name;
        string domicile;
        bool isRegistered;
        uint256 totalPoints;
        uint256 totalWasteWeight;
    }

    // Struktur data transaksi sampah
    struct WasteTransaction {
        address user;
        WasteType wasteType;
        uint256 weight;
        uint256 pointsEarned;
        uint256 timestamp;
    }

    // Add a new struct for point redemption
    struct PointRedemption {
        address user;
        uint256 pointsRedeemed;
        string service;
        uint256 timestamp;
    }

    // Mapping untuk menyimpan data pengguna
    mapping(address => User) public users;
    mapping(address => WasteTransaction[]) public userTransactions;

    // Mapping to store point redemption history
    mapping(address => PointRedemption[]) public pointRedemptionHistory;

    // Array untuk menyimpan semua transaksi
    WasteTransaction[] public allTransactions;

    // Variabel untuk konfigurasi poin
    mapping(WasteType => uint256) public wastePointMultipliers;

    // Events
    event UserRegistered(address indexed user, string name, string domicile);
    event WasteCollected(address indexed user, WasteType wasteType, uint256 weight, uint256 points);
    event PointsRedeemed(address indexed user, uint256 points, string service);

    // Constructor untuk inisialisasi multiplier poin
    constructor() {
        wastePointMultipliers[WasteType.ORGANIC] = 1;
        wastePointMultipliers[WasteType.PLASTIC] = 3;
        wastePointMultipliers[WasteType.PAPER] = 2;
        wastePointMultipliers[WasteType.METAL] = 4;
        wastePointMultipliers[WasteType.ELECTRONIC] = 5;
    }

    // Fungsi registrasi pengguna
    function registerUser(string memory _name, string memory _domicile) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            userAddress: msg.sender,
            name: _name,
            domicile: _domicile,
            isRegistered: true,
            totalPoints: 0,
            totalWasteWeight: 0
        });

        emit UserRegistered(msg.sender, _name, _domicile);
    }

    // Fungsi untuk mengumpulkan sampah
    function collectWaste(WasteType _wasteType, uint256 _weight) public {
        require(users[msg.sender].isRegistered, "User must be registered");
        require(_weight > 0, "Waste weight must be greater than zero");

        // Hitung poin berdasarkan jenis dan berat sampah
        uint256 pointsEarned = _weight * wastePointMultipliers[_wasteType];

        // Update data pengguna
        users[msg.sender].totalPoints += pointsEarned;
        users[msg.sender].totalWasteWeight += _weight;

        // Buat transaksi baru
        WasteTransaction memory newTransaction = WasteTransaction({
            user: msg.sender,
            wasteType: _wasteType,
            weight: _weight,
            pointsEarned: pointsEarned,
            timestamp: block.timestamp
        });

        // Tambahkan transaksi ke riwayat pengguna dan daftar transaksi global
        userTransactions[msg.sender].push(newTransaction);
        allTransactions.push(newTransaction);

        emit WasteCollected(msg.sender, _wasteType, _weight, pointsEarned);
    }

    // Fungsi untuk menukarkan poin
    function redeemPoints(uint256 _points, string memory _service) public {
        require(users[msg.sender].totalPoints >= _points, "Insufficient points");

        users[msg.sender].totalPoints -= _points;

        // Store redemption history
        PointRedemption memory redemption = PointRedemption({
            user: msg.sender,
            pointsRedeemed: _points,
            service: _service,
            timestamp: block.timestamp
        });
        pointRedemptionHistory[msg.sender].push(redemption);


        emit PointsRedeemed(msg.sender, _points, _service);
    }

    // Fungsi untuk melihat detail pengguna
    function getUserDetails() public view returns (User memory) {
        return users[msg.sender];
    }

    // Fungsi untuk melihat riwayat transaksi
    function getUserTransactions() public view returns (WasteTransaction[] memory) {
        return userTransactions[msg.sender];
    }

    // Add a function to retrieve point redemption history
    function getPointRedemptionHistory() public view returns (PointRedemption[] memory) {
        return pointRedemptionHistory[msg.sender];
    }
}