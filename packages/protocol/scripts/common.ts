import { BaseContract, BigNumber, Contract } from 'ethers';
import { ethers } from 'hardhat';
import { debug } from 'debug';
import * as chai from 'chai';

export const assert: Chai.AssertStatic = chai.assert;
export const expect: Chai.ExpectStatic = chai.expect;
import chaiAsPromised from 'chai-as-promised';
import { Fragment } from '@ethersproject/abi';
import fs from 'fs';
import util from 'util';

chai.use(chaiAsPromised);

declare global {
  export var debuglog: debug.Debugger;
}

global.debuglog = debug('UnitTest:log');
global.debuglog.color = '158';

export const debuglog = global.debuglog;

export const toBN = BigNumber.from;

export const FERTILIZER_TOKEN_ID = 0;

export function toWei(value: number | string): BigNumber {
  return ethers.utils.parseEther(value.toString());
}

export function toD6(value: number | string): BigNumber {
  if (typeof value === 'number') value = Math.floor(value * 10 ** 6) / 10 ** 6;
  return ethers.utils.parseUnits(value.toString(), 6);
}

export function fromWei(value: number | string | BigNumber): string {
  return ethers.utils.formatEther(value);
}

export function fromD6(value: number | string | BigNumber): string {
  return ethers.utils.formatUnits(value, 6);
}

export function mulDivRoundingUp(a: BigNumber, b: BigNumber, d: BigNumber): BigNumber {
  let x: BigNumber = a.mul(b).div(d);
  if (a.mul(b).mod(d).gt(0)) x = x.add(1);
  return x;
}

export function getSighash(funcSig: string): string {
  return ethers.utils.Interface.getSighash(Fragment.fromString(funcSig));
}
