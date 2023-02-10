import { ethers } from 'hardhat';

async function main() {
  const innerVerifierContract = await ethers.getContractFactory('InnerVerifier');
  const innerVerifier = await innerVerifierContract.deploy();
  await innerVerifier.deployed();
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
  //   await zsc.setToken(cashToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    console.log('deployed!');
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
