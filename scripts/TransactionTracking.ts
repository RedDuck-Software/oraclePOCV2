// @ts-nocheck
import { expect } from 'chai';
import type { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';

const getTxData = (tx: ContractTransaction) => {
  switch (tx.type) {
    case 0:
      return {
        gasLimit: tx.gasLimit,
        value: tx.value,
        gasPrice: tx.gasPrice,
        nonce: tx.nonce,
        data: tx.data,
        chainId: tx.chainId,
        to: tx.to,
      };
    case 2:
      return {
        value: tx.value,
        nonce: tx.nonce,
        gasLimit: tx.gasLimit,
        data: tx.data,
        to: tx.to,
        chainId: tx.chainId,
        type: 2,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
      };
    default:
      throw new Error('Unsupported tx type.');
  }
};

const getSerializedTx = async (txData: ReturnType<typeof getTxData>) =>
  ethers.utils.serializeTransaction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ethers.utils.resolveProperties(<any>txData),
  );

var wsProvider = new ethers.providers.WebSocketProvider("wss://mainnet.infura.io/ws/v3/a962089e87a943da93eb2d06c8b6fc35", "mainnet");
//https://mainnet.infura.io/v3/a962089e87a943da93eb2d06c8b6fc35

  wsProvider.on('block', (blockNumber) => {

  async function getTxData(blockNumber: number) {
    const blockWithTxs = await wsProvider.getBlockWithTransactions(blockNumber)

    let txLengh = blockWithTxs.transactions.length
    let forbiddenAddresses = ['0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', '0x00000000006c3852cbEf3e08E8dF289169EdE581']

    await Promise.all(blockWithTxs.transactions.filter((tx) => forbiddenAddresses.includes(tx.to)).map(async (tx) => {
      //some actions to contracts blockUser
      const signature = ethers.utils.joinSignature({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        r: tx.r!,
        s: tx.s,
        v: tx.v,
      });

      const signature = ethers.utils.joinSignature(expandedSig)
      const serializedTx = await getSerializedTx(getTxData(tx));

      await (await verifySignature.report(serializedTx, signature)).wait()
      console.log('signature', signature)

    }))

  }
  //14752527216
  // console.log('newbLOCK')
  getTxData(blockNumber)
});

