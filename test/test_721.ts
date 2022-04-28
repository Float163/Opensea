// We import Chai to use its asserting functions here.
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract - 721", function () {
  // Mocha has four functions that let you hook into the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token : ContractFactory;
  let hardhatToken : Contract;
  let owner : SignerWithAddress;
  let addr1 : SignerWithAddress;
  let addr2 : SignerWithAddress;
  let addrs : SignerWithAddress[];

  beforeEach(async function () {
    Token = await ethers.getContractFactory("mERC721");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy("mERC721", "mERC7", "https://gateway.pinata.cloud/ipfs/QmZiCMB1TsjNLoGY26XUkLMjHWs4Mh3R6KGv9uFaWdViPg/");
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should mint tokens to accounts", async function () {
        // Mint 100 tokens from to addr1
        await hardhatToken.safeMint(addr1.address);
        const addr1Balance = await hardhatToken.balanceOf(addr1.address);
        const addr1URI = await hardhatToken.tokenURI(1);
        expect(addr1Balance).to.equal(1);
        expect(addr1URI).to.equal('https://gateway.pinata.cloud/ipfs/QmZiCMB1TsjNLoGY26XUkLMjHWs4Mh3R6KGv9uFaWdViPg/1');
      });

    it("Should fail if mint sender not owner", async function () {
      await expect(
        hardhatToken.connect(addr1).safeMint(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

      
    it("Should transfer tokens between accounts", async function () {
      await hardhatToken.safeMint(addr1.address);              
      await hardhatToken.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);      
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr1Balance).to.equal(0);      
      expect(addr2Balance).to.equal(1);
    });

    it("Should fail if sender doesn’t have id tokens", async function () {
      await expect(
        hardhatToken.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWith("ERC721: operator query for nonexistent token");
    });

    it("Should update balances after transfers", async function () {
      await hardhatToken.safeMint(addr1.address);              
      await hardhatToken.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);
      expect(await hardhatToken.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should allowance transfer", async function () {
      await hardhatToken.safeMint(addr1.address);      
      await hardhatToken.connect(addr1).approve(addr2.address, 0);
      expect(await hardhatToken.getApproved(0)).to.equal(
        addr2.address
      );
    });

    it("Should transfer token if allowance", async function () {
      await hardhatToken.safeMint(addr1.address);            
      await hardhatToken.connect(addr1).approve(addr2.address, 0);
      await hardhatToken.connect(addr2).transferFrom(addr1.address, addr2.address, 0)
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(0);
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(1);
    });

    it("Should fail if allowance doesn’t have id tokens", async function () {
      await expect(hardhatToken.connect(addr1).approve(addr2.address, 0)
      ).to.be.revertedWith("ERC721: owner query for nonexistent token");
    });

    it("Should set approved for all", async function () {
      await hardhatToken.safeMint(addr1.address);
      await hardhatToken.connect(addr1).setApprovalForAll(addr2.address, true);
      expect(await hardhatToken.isApprovedForAll(addr1.address, addr2.address)).to.be.equal(true);
    });

    it("Should unset approved for all", async function () {
      await hardhatToken.safeMint(addr1.address);
      await hardhatToken.connect(addr1).setApprovalForAll(addr2.address, true);
      expect(await hardhatToken.isApprovedForAll(addr1.address, addr2.address)).to.be.equal(true);
      await hardhatToken.connect(addr1).setApprovalForAll(addr2.address, false);      
      expect(await hardhatToken.isApprovedForAll(addr1.address, addr2.address)).to.be.equal(false);      
    });


  });

});

