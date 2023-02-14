import { ContractTransaction } from 'ethers';
import hre, { ethers, network, web3 } from 'hardhat';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomiclabs/hardhat-ethers';
import { time } from '@nomicfoundation/hardhat-network-helpers';
import Client from '../../anonymous.js/src/client.js';
import { expect, sleep } from '../scripts/common';

// const { ethers } = require('hardhat');
describe('Testing Zether', function () {
  let alice; // will reuse...
  let bob;
  let carol;
  let dave;
  let miner;
  let cashToken;
  let zsc;
  let signers;
  it('Deployment should assign the total supply of tokens to the owner', async function () {
    signers = await ethers.getSigners();
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
    zsc = await zscConstract.deploy();
    await zsc.deployed();
    await zsc.init(cashToken.address, 12);
    await cashToken.mint(owner.address, 1000);
    await cashToken.approve(zsc.address, 1000);      
  });

  it('should allow minting and approving', async () => {
    alice = new Client(web3, zsc, signers[0], signers);
    await alice.register(process.env.ZETHER_OWNER);  
    await sleep(20000);
    // syncing block time for simulation
    let nowTime = Date.now();
    if(network.name === 'hardhat') await time.setNextBlockTimestamp(Math.floor((nowTime + 1000 + Math.random() * 2000) / 1000));
    await alice.deposit(100);
    await sleep(20000);
    // syncing block time for simulation
    nowTime = Date.now();
    if(network.name === 'hardhat') await time.setNextBlockTimestamp(Math.floor((nowTime + 1000 + Math.random() * 2000) / 1000));
    await alice.withdraw(10);
  }).timeout(120000);
});
