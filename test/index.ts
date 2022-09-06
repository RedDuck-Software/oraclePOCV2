import { expect } from 'chai';
import { Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { chainIds } from '../config';

describe('Greeter', function () {
  it("Should return the new greeting once it's changed", async function () {
    let privateKey = "77797a2dc15aada1116394fd770dd56374524a5f05fb13f46073b9cab2e98ddc"; // zelensky PK
    const [defaultHardhatSig] = await ethers.getSigners()
    const signer = new Wallet(privateKey, ethers.provider)

    await defaultHardhatSig.sendTransaction( { value:ethers.utils.parseEther("100"), to: signer.address})
    const Greeter = await ethers.getContractFactory('Greeter',signer);
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();

    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');

    const tx = await greeter.connect(signer).setGreeting('HELLO2')
    
    await tx.wait()
    console.log("tx: ", tx);

/*
export type TransactionRequest = {
    to?: string,
    from?: string,
    nonce?: BigNumberish,

    gasLimit?: BigNumberish,
    gasPrice?: BigNumberish,

    data?: BytesLike,
    value?: BigNumberish,
    chainId?: number

    type?: number;
    accessList?: AccessListish;

    maxPriorityFeePerGas?: BigNumberish;
    maxFeePerGas?: BigNumberish;

    customData?: Record<string, any>;
    ccipReadEnabled?: boolean;
}
*/
    const transactionData = 
    { 
      to: tx.to,
      value: tx.value,
      data: tx.data,
      gasLimit: tx.gasLimit,
      nonce: tx.nonce,
      type: 2,
      chainId: tx.chainId
    };
    
    
    let signatureManualFull = await signer.signTransaction(transactionData);
    let signatureManualSplit = ethers.utils.splitSignature(signatureManualFull);
    
    console.log("LOG signatureManual:", signatureManualSplit);

    expect(signatureManualSplit.v).to.equal(tx.v);
    expect(signatureManualSplit.r).to.equal(tx.r);
    expect(signatureManualSplit.s).to.equal(tx.s);
  

    
  });
  it('TEST', async () => {
    const signer = new ethers.Wallet(
      '061139e6b3a0419d6a61b0f5ff9c43519edd2dbf808f77de78fe6eb0d5fb096f',
      ethers.provider,
    );
    const tx1 = {
      to: '0xa238b6008Bc2FBd9E386A5d4784511980cE504Cd',
      value: ethers.utils.parseEther('1'),
      gasLimit: '21000',
      nonce: 1,
      type: 2,
      chainId: 3,
    };
    const tx2 = {
      ...tx1,
      maxPriorityFeePerGas: ethers.utils.parseUnits('5', 'gwei'),
      maxFeePerGas: ethers.utils.parseUnits('20', 'gwei'),
    };
    const rawTx1 = await signer
      .signTransaction(tx1)
      .then(() => ethers.utils.serializeTransaction(tx1));
    const rawTx2 = await signer
      .signTransaction(tx1)
      .then(() => ethers.utils.serializeTransaction(tx2));
    console.log(rawTx1);
    console.log(rawTx2);
  });
});
