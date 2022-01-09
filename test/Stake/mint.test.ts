import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre, { network, deployments, run, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Chimps } from "../../typechain";
import { utils, Contract } from "ethers";
import { expect } from "chai";
import {
  PRICE,
  BASE_URI,
  MAX_SUPPLY,
  testingChimpsArgs,
  ROYALTIES_BIPS,
  SALE_START_TIMESTAMP,
} from "../../helpers";
// eslint-disable-next-line node/no-extraneous-import
import { BigNumber } from "@ethersproject/bignumber";
import { getBlockTimestamp, increaseBlockTime } from "../helpers";

const price = utils.parseEther("1");
const { deploy } = deployments;

describe("Chimps minting testing", async () => {
  let chimpsDeployment: Deployment;
  let chimpsContract: Chimps;
  let deployer: SignerWithAddress;
  let rest: SignerWithAddress[];

  beforeEach(async () => {
    await deployments.fixture(["testing"]); // ?: will deploy a new instance before each it() call
    [deployer, ...rest] = await ethers.getSigners();

    chimpsDeployment = await deployments.get("Chimps");

    chimpsContract = await ethers.getContractAt(
      "Chimps",
      chimpsDeployment.address,
      deployer
    );
  });

  it("mint price is 1 ETH", async () => {
    const mintPrice = await chimpsContract.mintPrice();
    expect("1.0").to.equal(utils.formatEther(mintPrice));
    await chimpsContract.updateMintPrice(utils.parseEther("50"));
  });

  it("should mint properly and randomly", async () => {
    const user1 = rest[0];
    await chimpsContract.connect(user1).mintChimp(2, { value: price.mul(2) });
    const balanceOfUser1 = await chimpsContract.balanceOf(user1.address);
    expect(balanceOfUser1).to.equal("2");
    const tokenId1 = await chimpsContract.tokenOfOwnerByIndex(user1.address, 0);
    const tokenId2 = await chimpsContract.tokenOfOwnerByIndex(user1.address, 1);
    expect([tokenId1.toString(), tokenId2.toString()]).to.not.deep.equal([
      "0",
      "1",
    ]);
    const tokenURI1 = await chimpsContract.tokenURI(tokenId1.toString());
    const tokenURI2 = await chimpsContract.tokenURI(tokenId2.toString());
    expect(tokenURI1).to.equal(BASE_URI + tokenId1.toString() + ".json");
    expect(tokenURI2).to.equal(BASE_URI + tokenId2.toString() + ".json");
  });

  it("should allow up to 10 mints", async () => {
    await chimpsContract
      .connect(rest[1])
      .mintChimp(10, { value: price.mul(10) });
    const balanceOfUser = await chimpsContract.balanceOf(rest[1].address);
    expect(balanceOfUser).to.equal(10);
    await expect(
      chimpsContract.connect(rest[1]).mintChimp(11, { value: price.mul(11) })
    ).to.be.revertedWith("Can only mint a maximum of 10 chimps");
  });

  it("must mint with correct price", async () => {
    await expect(
      chimpsContract.mintChimp(1, { value: price.mul(2) })
    ).to.be.revertedWith("Incorrect payment amount");
  });

  it("should emit all tokenIds upon mint", async () => {
    const userOne = rest[0];

    const tx = await chimpsContract
      .connect(userOne)
      .mintChimp(10, { value: price.mul(BigNumber.from(10)) });

    const data = await tx.wait();

    const chimpsMintedEvent = data!.events!.find(
      ({ event }) => event === "ChimpsMinted"
    );

    const tokenIdsBought = chimpsMintedEvent!.args!.tokenIds;

    expect(tokenIdsBought.length).to.equal(10);

    for (let i = 0; i < tokenIdsBought.length; i++) {
      const id = tokenIdsBought[i];
      const owner = await chimpsContract.ownerOf(id);

      expect(owner).to.equal(userOne.address);
    }
  });

  it("should increase the admins earnings", async () => {
    const [userOne] = rest;

    const ownerBeforeBalance = await ethers.provider.getBalance(
      deployer.address
    );

    const tx = await chimpsContract
      .connect(userOne)
      .mintChimp(10, { value: price.mul(10) });

    await tx.wait();

    const ownerAfterBalance = await ethers.provider.getBalance(
      deployer.address
    );

    expect(ownerAfterBalance.sub(ownerBeforeBalance).toString()).to.equal(
      price.mul(10).toString()
    );

    // Contract maintains zero balance
    const contractBalance = await ethers.provider.getBalance(
      chimpsContract.address
    );

    expect(contractBalance.toString()).to.equal("0");
  });

  it("should allow owner to update mintPrice", async () => {
    const newPrice = utils.parseEther("0.1");
    await chimpsContract.connect(deployer).updateMintPrice(newPrice);

    const userOne = rest[0];

    await chimpsContract.connect(userOne).mintChimp(1, { value: newPrice });

    const balance = await chimpsContract.balanceOf(userOne.address);

    expect(balance.toString()).to.equal("1");
  });

  it("should allow admin mint before actual mint time and mint to anyone and also mint in order", async () => {
    const userOne = rest[0];

    const now = await getBlockTimestamp();

    const chimpsContractFactory = await ethers.getContractFactory("Chimps");

    const chimpsContract2 = await chimpsContractFactory
      .connect(deployer)
      .deploy(price, "testing/", now + 60, 500, 50);

    await chimpsContract2.connect(deployer).adminMintChimp(2, userOne.address);

    const tokenId = await chimpsContract2.tokenOfOwnerByIndex(
      userOne.address,
      0
    );

    const tokenId2 = await chimpsContract2.tokenOfOwnerByIndex(
      userOne.address,
      1
    );

    expect([tokenId.toString(), tokenId2.toString()]).to.deep.equal(["0", "1"]);
  });

  it("should admin mint then user mint", async () => {
    const [userOne, userTwo] = rest;

    const now = await getBlockTimestamp();

    const chimpsContractFactory = await ethers.getContractFactory("Chimps");

    const chimpsContract2 = await chimpsContractFactory
      .connect(deployer)
      .deploy(price, "testing/", now + 60, 500, 50);

    await chimpsContract2.connect(deployer).adminMintChimp(30, userOne.address);

    await increaseBlockTime(60);

    await chimpsContract2
      .connect(userTwo)
      .mintChimp(10, { value: price.mul(10) });
    await chimpsContract2
      .connect(userTwo)
      .mintChimp(10, { value: price.mul(10) });
  });

  it("should allow tokenURI to be updated", async () => {
    const userOne = rest[0];

    await chimpsContract.connect(userOne).mintChimp(2, { value: price.mul(2) });

    const tokenId = await chimpsContract.tokenOfOwnerByIndex(
      userOne.address,
      0
    );

    const tokenURI = await chimpsContract.tokenURI(tokenId.toString());

    expect(tokenURI).to.equal(`${BASE_URI}${tokenId}.json`);

    const anotherUrl = "https://another.url/";

    await chimpsContract.connect(deployer).updateBaseURIValue(anotherUrl);

    const tokenURI2 = await chimpsContract.tokenURI(tokenId.toString());

    expect(tokenURI2).to.equal(`${anotherUrl}${tokenId}.json`);
  });

  describe("error handling", () => {
    let chimpsContract2: Contract;

    beforeEach(async () => {
      const chimpsContractFactory = await ethers.getContractFactory("Chimps");

      chimpsContract2 = await chimpsContractFactory
        .connect(deployer)
        .deploy(price, "testing/", SALE_START_TIMESTAMP, 500, 50);
    });
    it("should not allow 0 mint", async () => {
      const userOne = rest[0];

      await expect(
        chimpsContract2.connect(userOne).mintChimp(0)
      ).to.be.revertedWith("Cannot mint 0 chimps");
    });

    it("should not allow more than 10 mints", async () => {
      const userOne = rest[0];

      await expect(
        chimpsContract2
          .connect(userOne)
          .mintChimp(11, { value: price.mul(BigNumber.from(11)) })
      ).to.be.revertedWith("Can only mint a maximum of 10 chimps");
    });

    it("should not allow mints with less fee paid", async () => {
      const userOne = rest[0];

      await expect(
        chimpsContract2
          .connect(userOne)
          .mintChimp(10, { value: price.mul(BigNumber.from(9)) })
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("should not allow mints with more fee paid", async () => {
      const userOne = rest[0];

      await expect(
        chimpsContract2
          .connect(userOne)
          .mintChimp(10, { value: price.mul(BigNumber.from(11)) })
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("cannot mint more once sold out", async () => {
      const userTwo = rest[1];

      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });

      await expect(
        chimpsContract2.connect(userTwo).mintChimp(1, { value: price })
      ).to.be.revertedWith("All chimps have already been minted");
    });

    it("cannot mint more than MAX_SUPPLY", async () => {
      const userTwo = rest[1];

      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(10, { value: price.mul(BigNumber.from(10)) });
      await chimpsContract2
        .connect(userTwo)
        .mintChimp(5, { value: price.mul(BigNumber.from(5)) });

      await expect(
        chimpsContract2
          .connect(userTwo)
          .mintChimp(10, { value: price.mul(BigNumber.from(10)) })
      ).to.be.revertedWith("Exceeds max supply of chimps");
    });

    it("should not allow mint until start time has elapsed", async () => {
      const userOne = rest[0];

      const now = await getBlockTimestamp();

      const chimpsContractFactory = await ethers.getContractFactory("Chimps");

      const chimpsContract3 = await chimpsContractFactory
        .connect(deployer)
        .deploy(price, "testing/", now + 60, 500, 50);

      await expect(
        chimpsContract3.connect(userOne).mintChimp(1, { value: price })
      ).to.be.revertedWith("Sale has not yet started");

      // elapsed 30 seconds, still canot mint
      await increaseBlockTime(30);

      await expect(
        chimpsContract3.connect(userOne).mintChimp(1, { value: price })
      ).to.be.revertedWith("Sale has not yet started");

      // elapsed 60 seconds, now can mint
      await increaseBlockTime(30);

      await chimpsContract3.connect(userOne).mintChimp(1, { value: price });
    });

    it("should not allow non owner to update mintPrice", async () => {
      const newPrice = utils.parseEther("0.1");
      const userOne = rest[0];

      await expect(
        chimpsContract2.connect(userOne).updateMintPrice(newPrice)
      ).to.be.revertedWith("caller is not the owner");
    });

    it("should not allow anyone to use admin mint", async () => {
      const userOne = rest[0];

      await expect(
        chimpsContract2.connect(userOne).adminMintChimp(1, userOne.address)
      ).to.be.revertedWith("caller is not the owner");
    });

    it("should only allow owner to update baseURI", async () => {
      const userOne = rest[0];

      await chimpsContract2
        .connect(userOne)
        .mintChimp(2, { value: price.mul(2) });

      const anotherUrl = "https://another.url/";

      await expect(
        chimpsContract2.connect(userOne).updateBaseURIValue(anotherUrl)
      ).to.be.revertedWith("caller is not the owner");
    });
  });
});
