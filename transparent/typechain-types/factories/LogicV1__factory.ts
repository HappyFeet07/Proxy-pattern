/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { LogicV1, LogicV1Interface } from "../LogicV1";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "ret",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_impl",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506103ea806100206000396000f3fe60806040526004361061003f5760003560e01c80633659cfe61461004457806370a082311461006d5780638da5cb5b146100aa578063d0e30db0146100d5575b600080fd5b34801561005057600080fd5b5061006b60048036038101906100669190610236565b6100df565b005b34801561007957600080fd5b50610094600480360381019061008f9190610236565b610123565b6040516100a191906102c1565b60405180910390f35b3480156100b657600080fd5b506100bf61016b565b6040516100cc919061027d565b60405180910390f35b6100dd610191565b005b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b346000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546101df91906102dc565b925050819055507fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c3334604051610217929190610298565b60405180910390a1565b6000813590506102308161039d565b92915050565b60006020828403121561024857600080fd5b600061025684828501610221565b91505092915050565b61026881610332565b82525050565b61027781610364565b82525050565b6000602082019050610292600083018461025f565b92915050565b60006040820190506102ad600083018561025f565b6102ba602083018461026e565b9392505050565b60006020820190506102d6600083018461026e565b92915050565b60006102e782610364565b91506102f283610364565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156103275761032661036e565b5b828201905092915050565b600061033d82610344565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6103a681610332565b81146103b157600080fd5b5056fea2646970667358221220766461e0f910a797de449edcf12ea6de1947e24c685067f8c404607a4ee9645264736f6c63430008000033";

type LogicV1ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LogicV1ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LogicV1__factory extends ContractFactory {
  constructor(...args: LogicV1ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LogicV1> {
    return super.deploy(overrides || {}) as Promise<LogicV1>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LogicV1 {
    return super.attach(address) as LogicV1;
  }
  connect(signer: Signer): LogicV1__factory {
    return super.connect(signer) as LogicV1__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LogicV1Interface {
    return new utils.Interface(_abi) as LogicV1Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LogicV1 {
    return new Contract(address, _abi, signerOrProvider) as LogicV1;
  }
}