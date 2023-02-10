import Client from '../../anonymous.js/src/client.js';
import { ContractAddresses } from '../scripts/constants';
import { Contract, Wallet, providers } from 'ethers';
import ZSC_ABI from '../artifacts/contracts/ZSC.sol/ZSC.json';
import TOKEN_ABI from '../artifacts/contracts/CashToken.sol/CashToken.json';

const main = async () => {
  let alice; // will reuse...
  let zscContractAddress;
  let zEtherContractAddress;
  let burnVerifierContractAddress;
  let cashTokenAddress;
  const network = {
    name: 'goerli',
  };
  if (ContractAddresses[network.name].ZSC) {
    zscContractAddress = ContractAddresses[network.name].ZSC;
    zEtherContractAddress = ContractAddresses[network.name].ZetherVerifier;
    burnVerifierContractAddress = ContractAddresses[network.name].BurnVerifier;
    cashTokenAddress = ContractAddresses[network.name].CashToken;
  }
  if (!zscContractAddress) return;  
  const provider = new providers.JsonRpcProvider(
    `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
  );
  const ownerWallet = new Wallet(process.env.DEPLOYER_KEY?.toString() || '', provider);
  const zsc = new Contract(zscContractAddress, ZSC_ABI.abi, provider);
  const token = new Contract(cashTokenAddress, TOKEN_ABI.abi, provider);
  const tx = await token.connect(ownerWallet).approve(zsc.address, 1000);
  tx.wait();
  alice = new Client(provider, zsc, ownerWallet, [ownerWallet]);
  await alice.register();
  await alice.deposit(100);
  await alice.withdraw(10);
};

main()
  .then()
  .catch((error) => {
    console.log(error);
  });
