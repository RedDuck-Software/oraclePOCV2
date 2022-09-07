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

describe.only('Signature Verify', () => {
  const fixture = async () => {
    const [signer] = await ethers.getSigners();
    const [verifyFactory, greeterFactory] = await Promise.all([
      ethers.getContractFactory('SignatureVerify', signer),
      ethers.getContractFactory('Greeter', signer),
    ]);
    const [verifySignature, greeter] = await Promise.all([
      (await verifyFactory.deploy()).deployed(),
      (await greeterFactory.deploy('Hello, world!')).deployed(),
    ]);

    return {
      verifySignature,
      greeter,
      signer,
    };
  };

  it('Should not blacklist user', async () => {
    const { verifySignature, signer, greeter } = await fixture();

    const tx = await greeter.connect(signer).setGreeting('HELLO2');
    await tx.wait();
    const serializedTx = await getSerializedTx(getTxData(tx));

    const signature = ethers.utils.joinSignature({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      r: tx.r!,
      s: tx.s,
      v: tx.v,
    });

    console.log(serializedTx);
    const addressFromReport = await verifySignature.callStatic.report(
      serializedTx,
      signature,
    );
    await expect(
      addressFromReport,
      'Address from report is not equal to signer address',
    ).eq(signer.address);
    await expect(verifySignature.report(serializedTx, signature)).not.reverted;
    const recoveredAddress = ethers.utils.recoverAddress(
      ethers.utils.arrayify(ethers.utils.keccak256(serializedTx)),
      signature,
    );

    expect(
      recoveredAddress,
      'Recovered address is not equal to signer address',
    ).eq(signer.address);
    console.log(recoveredAddress);

    const isUserBlacklisted = await verifySignature.blacklistedUsers(
      signer.address,
    );
    expect(isUserBlacklisted, 'User should not be blacklisted').eq(false);
  });
});
