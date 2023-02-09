import { ContractTransaction } from 'ethers';
import hre, { ethers, web3 } from 'hardhat';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-ethers';
import Client from '../../anonymous.js/src/client.js';
import { expect } from '../scripts/common';

// const { ethers } = require('hardhat');
describe('Token contract', function () {
  let alice; // will reuse...
  let bob;
  let carol;
  let dave;
  let miner;
  let cashToken;
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const CashTokenConstract = await ethers.getContractFactory('CashToken');
    cashToken = await CashTokenConstract.deploy();
    const ownerBalance = await cashToken.balanceOf(owner.address);
    expect(await cashToken.totalSupply()).to.equal(ownerBalance);
  });
  it('should allow minting and approving', async () => {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const innerVerifierContract = await ethers.getContractFactory('InnerVerifier');
    const innerVerifier = await innerVerifierContract.deploy();
    const burnVerifierContract = await ethers.getContractFactory('BurnVerifier', {
      libraries: {
        InnerVerifier: innerVerifier.address,
      },
    });
    const burnVerifier = await burnVerifierContract.deploy();
    await burnVerifier.deployed();
    const zetherVerifierContract = await ethers.getContractFactory('ZetherVerifier', {
      libraries: {
        InnerVerifier: innerVerifier.address,
      },
    });
    const zetherVerifier = await zetherVerifierContract.deploy();
    await zetherVerifier.deployed();
    const libraries = {};
    libraries['BurnVerifier'] = burnVerifier.address;
    libraries['ZetherVerifier'] = zetherVerifier.address;
    const zscConstract = await ethers.getContractFactory('ZSC', { libraries });
    const zsc = await zscConstract.deploy();
    await zsc.deployed();
    await zsc.init();
    await zsc.setToken(cashToken.address);
    await cashToken.mint(owner.address, 1000);
    await cashToken.approve(zsc.address, 1000);
    
    // const web3 = new Web3('http://localhost:8545');
    alice = new Client(web3, zsc, owner.address, signers);
    await alice.register();
    await alice.deposit(100);
    await alice.withdraw(10);
  });
});
