import type { ContractTransaction } from 'ethers';
import { ethers } from 'hardhat';

const wsProvider = new ethers.providers.WebSocketProvider(
  'wss://goerli.infura.io/ws/v3/a962089e87a943da93eb2d06c8b6fc35',
  'goerli',
);
// https://goerli.infura.io/v3/a962089e87a943da93eb2d06c8b6fc35

const VERIFY_SIGNATURE_ADDRESS = '0xC5e935C06D69C0C0D9C2502cC11d4eA83C69D284';
const FORBIDDEN_ADDRESSES = [
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  '0x00000000006c3852cbEf3e08E8dF289169EdE581',
  '0xdA0Fb2305EEad572fEAe4ee8C058C75760D49154',
];

console.log('Script started.');

wsProvider.on('block', async (blockNumber) => {
  console.log('Found new block.');
  const blockWithTxs = await wsProvider.getBlockWithTransactions(blockNumber);

  await Promise.all(
    blockWithTxs.transactions
      .filter((tx) => tx.to && FORBIDDEN_ADDRESSES.includes(tx.to))
      .map(async (tx) => {
        // some actions to contracts blockUser
        console.log('Found tx to forbidden address.');

        const expandedSig = ethers.utils.joinSignature({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          r: tx.r!,
          s: tx.s,
          v: tx.v,
        });

        const signature = ethers.utils.joinSignature(expandedSig);
        const serializedTx = await getSerializedTx(getTxData(tx));

        const [signer] = await ethers.getSigners();
        console.log(`Signer: ${signer.address}`);
        const verifySignature = await ethers.getContractAt(
          'SignatureVerify',
          VERIFY_SIGNATURE_ADDRESS,
          signer,
        );
        await (await verifySignature.report(serializedTx, signature)).wait();
        console.log('signature', signature);
      }),
  );
});

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
