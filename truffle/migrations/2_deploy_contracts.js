const BankSampahContract = 
artifacts.require("BankSampahContract"); 

module.exports = function (deployer) { 
    deployer.deploy(BankSampahContract); 
};