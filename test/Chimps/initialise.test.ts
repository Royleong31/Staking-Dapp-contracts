import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import hre, { network, deployments, run, ethers } from "hardhat";
import { Deployment } from "hardhat-deploy/dist/types";
import { Chimps } from "../../typechain";
import { expect } from "chai";
import {
  PRICE,
  BASE_URI,
  MAX_SUPPLY,
  SALE_START_TIMESTAMP,
} from "../../helpers";

describe("Chimps deployment", async () => {
  let chimpsDeployment: Deployment;
  let chimpsContract: Chimps;

  let accounts: SignerWithAddress[];
  let deployer: SignerWithAddress;

  beforeEach(async () => {
    await deployments.fixture(["chimps"]);
    accounts = await ethers.getSigners();
    deployer = accounts[0];

    chimpsDeployment = await deployments.get("Chimps");

    chimpsContract = await ethers.getContractAt(
      "Chimps",
      chimpsDeployment.address,
      accounts[0]
    );
  });

  it("has correct address", async () => {
    const owner = await chimpsContract.owner();
    expect(owner).to.be.equal(accounts[0].address);
  });

  it("will revert if royalty percentage is above 25%", async () => {
    const chimpsContractFactory = await ethers.getContractFactory("Chimps");
    await expect(
      chimpsContractFactory
        .connect(deployer)
        .deploy(PRICE, BASE_URI, SALE_START_TIMESTAMP, 2500, MAX_SUPPLY)
    ).to.be.revertedWith("Royalties cannot exceed 25%");
  });

  it("should have the correct symbols", async () => {
    const name = await chimpsContract.name();
    expect(name).to.be.equal("CuteChimps");
    const symbol = await chimpsContract.symbol();
    expect(symbol).to.be.equal("CHIMP");
  });

  it("has correct baseURI", async () => {
    const baseURI = await chimpsContract.baseURIValue();
    expect(baseURI).to.equal(BASE_URI);
  });

  it("can set baseURI", async () => {
    await chimpsContract.updateBaseURIValue("New value");
    const baseURI = await chimpsContract.baseURIValue();
    expect(baseURI).to.equal("New value");
  });

  // it("can emit event", async () => {
  //   const result = await oracleContract.add100(50);
  //   const receipt = await result.wait();

  //   // ?: cannot get return value directly from contract call, unless the function is view or pure. Use events to return value to caller
  //   const event = receipt.events!.find(({ event }) => event === "Number")!;
  //   const eventArgs = event.args!;
  //   expect(eventArgs.initialNum.toString()).to.be.equal("50");
  //   expect(eventArgs.finalNum.toString()).to.be.equal("150");
  //   expect(eventArgs.remarks.toString()).to.be.equal("Addition");

  //   // ?: alternative way to check for events using hardhat-waffle
  //   // ?: event chaining is not supported by vscode mocha test explorer extension, so use 'hh test'
  //   await expect(oracleContract.add100(30))
  //     .to.emit(oracleContract, "TestingEvent")
  //     .withArgs(30)
  //     .to.emit(oracleContract, "Number")
  //     .withArgs(30, 130, "Addition");
  // });

  // it("has the correct keyhash and fee", async () => {
  //   const keyhash = await oracleContract.keyHash();
  //   const fee = await oracleContract.fee();

  //   expect(keyhash).to.equal(networkConfig["31337"].keyHash);
  //   expect(fee).to.equal(networkConfig["31337"].fee);
  // });
});
