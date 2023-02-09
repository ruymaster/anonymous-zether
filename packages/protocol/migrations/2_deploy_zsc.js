var InnerVerifier = artifacts.require("InnerVerifier");
var BurnVerifier = artifacts.require("BurnVerifier");
var ZetherVerifier = artifacts.require("ZetherVerifier");
var CashToken = artifacts.require("CashToken");
var ZSC = artifacts.require("ZSC");

module.exports = async (deployer) => {
    await deployer.deploy(CashToken);
    await deployer.deploy(InnerVerifier, { gas: 6721975 });
    await deployer.link(InnerVerifier, ZetherVerifier);
    await deployer.link(InnerVerifier, BurnVerifier);
    await deployer.deploy(ZetherVerifier, { gas: 6721975 });
    await deployer.deploy(BurnVerifier, { gas: 6721975 });
    await deployer.link(ZetherVerifier, ZSC);
    await deployer.link(BurnVerifier, ZSC);
    await deployer.deploy(ZSC, CashToken.address, 6);
}