import { expect } from 'chai';
import { Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { chainIds } from '../config';

describe('Greeter', function () {
  it.only("Should return the new greeting once it's changed", async function () {
    const privateKey =
      '77797a2dc15aada1116394fd770dd56374524a5f05fb13f46073b9cab2e98ddc'; // zelensky PK
    const [defaultHardhatSig] = await ethers.getSigners()
    const signer = new Wallet(privateKey, ethers.provider)

    await defaultHardhatSig.sendTransaction({ value:ethers.utils.parseEther("100"), to: signer.address})
    const Greeter = await ethers.getContractFactory('Greeter', signer);
    const greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();

    const Verify = await ethers.getContractFactory('SignatureVerify', signer);
    const verify = await Verify.deploy(ethers.constants.AddressZero);
    await verify.deployed();

    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');

    const tx = await greeter.connect(signer).setGreeting('HELLO2')
    
    await tx.wait()
    console.log("tx: ", tx);

    const expandedSig = {
      r: tx.r!,
      s: tx.s,
      v: tx.v
     }
     
    const signature = ethers.utils.joinSignature(expandedSig)
     
    let txData : any;
    switch (tx.type) {
        case 0:
            txData = {
              gasLimit: tx.gasLimit,
              value: tx.value,
              gasPrice: tx.gasPrice,
                nonce: tx.nonce,
                data: tx.data,
                chainId: tx.chainId,
                to: tx.to
            };
            break;
        case 2:
            txData = {
              value: tx.value,
              nonce: tx.nonce,
              gasLimit: tx.gasLimit,
                data: tx.data,
                to: tx.to,
                chainId: tx.chainId,
                type: 2,
                maxFeePerGas: tx.maxFeePerGas,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas
            }
            break;
        default:
            throw "Unsupported tx type";
    }

    const rsTx:any = await ethers.utils.resolveProperties(txData)
    const raw = ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
    const msgHash = ethers.utils.keccak256(raw) // as specified by ECDSA
    const msgBytes = ethers.utils.arrayify(msgHash) // create binary hash
    const addressFromContract = await verify.recover(msgHash, expandedSig.v!, expandedSig.r, expandedSig.s!);
    const recoveredPubKey = ethers.utils.recoverPublicKey(msgBytes, signature);
    const recoveredAddress = ethers.utils.recoverAddress(msgBytes, signature);

    console.log("signer address: %s, recovered address: %s", signer.address, recoveredAddress);
    
    expect(recoveredAddress).to.equal(signer.address);
    expect(addressFromContract).to.equal(signer.address);

    
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
