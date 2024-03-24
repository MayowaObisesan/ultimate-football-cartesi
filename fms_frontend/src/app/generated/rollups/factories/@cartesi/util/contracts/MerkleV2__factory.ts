/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../common";
import type {
  MerkleV2,
  MerkleV2Interface,
} from "../../../../@cartesi/util/contracts/MerkleV2";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32[]",
        name: "hashes",
        type: "bytes32[]",
      },
    ],
    name: "calculateRootFromPowerOfTwo",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "getEmptyTreeHashAtIndex",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_wordIndex",
        type: "uint256",
      },
    ],
    name: "getHashOfWordAtIndex",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "_log2Size",
        type: "uint256",
      },
    ],
    name: "getMerkleRootFromBytes",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_position",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_logSizeOfReplacement",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_logSizeOfFullDrive",
        type: "uint256",
      },
      {
        internalType: "bytes32",
        name: "_replacement",
        type: "bytes32",
      },
      {
        internalType: "bytes32[]",
        name: "siblings",
        type: "bytes32[]",
      },
    ],
    name: "getRootAfterReplacementInDrive",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6115e861003a600b82828239805160001a60731461002d57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100615760003560e01c806334bd712d14610066578063451a10551461008b57806379de46011461009e57806382b0eab8146100b1578063c84583a1146100c4575b600080fd5b610079610074366004610ad9565b6100d7565b60405190815260200160405180910390f35b610079610099366004610b51565b610229565b6100796100ac366004610b6a565b6102ba565b6100796100bf366004610c1b565b6104d0565b6100796100d2366004610ad9565b6106cb565b6000600382901b816100ea600883610cef565b9050848211156101365760405162461bcd60e51b8152602060048201526012602482015271776f7264206f7574206f6620626f756e647360701b60448201526064015b60405180910390fd5b8481116101795761014981838789610d08565b60405160200161015a929190610d32565b6040516020818303038152906040528051906020012092505050610222565b60408051600880825281830190925260009160208201818036833701905050905060006101a68488610d42565b905060005b818110156102135788886101bf8388610cef565b8181106101ce576101ce610d55565b9050013560f81c60f81b8382815181106101ea576101ea610d55565b60200101906001600160f81b031916908160001a9053508061020b81610d6b565b9150506101ab565b50508051602090910120925050505b9392505050565b600080610237836020610d84565b9050610244816020610cef565b6107a0101561028b5760405162461bcd60e51b8152602060048201526013602482015272696e646578206f7574206f6620626f756e647360681b604482015260640161012d565b600080604051806107c001604052806107a08152602001610e136107a091399290920160200151949350505050565b60008585101580156102cd575060038610155b80156102da575060408511155b6103445760405162461bcd60e51b815260206004820152603560248201527f33203c3d206c6f6753697a654f665265706c6163656d656e74203c3d206c6f6760448201527414da5e9953d9919d5b1b111c9a5d99480f0f480d8d605a1b606482015260840161012d565b600180871b9088906103569083610d42565b16156103a45760405162461bcd60e51b815260206004820152601760248201527f506f736974696f6e206973206e6f7420616c69676e6564000000000000000000604482015260640161012d565b6103ae8787610d42565b83146103fc5760405162461bcd60e51b815260206004820152601b60248201527f50726f6f66206c656e67746820646f6573206e6f74206d617463680000000000604482015260640161012d565b60005b838110156104c35781811b8916600003610464578585858381811061042657610426610d55565b90506020020135604051602001610447929190918252602082015260400190565b6040516020818303038152906040528051906020012095506104b1565b84848281811061047657610476610d55565b9050602002013586604051602001610498929190918252602082015260400190565b6040516020818303038152906040528051906020012095505b806104bb81610d6b565b9150506103ff565b5093979650505050505050565b805160405163d82ae4b160e01b815260009173__$981c3d8984149aeea734929c44e255f96b$__9163d82ae4b19161050e9160040190815260200190565b602060405180830381865af415801561052b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061054f9190610d9b565b61059b5760405162461bcd60e51b815260206004820152601860248201527f6172726179206c656e206e6f7420706f776572206f6620320000000000000000604482015260640161012d565b81516001036105c657816000815181106105b7576105b7610d55565b60200260200101519050919050565b600060018351901c67ffffffffffffffff8111156105e6576105e6610c05565b60405190808252806020026020018201604052801561060f578160200160208202803683370190505b50905060005b83518110156106c15783818151811061063057610630610d55565b6020026020010151848260016106469190610cef565b8151811061065657610656610d55565b6020026020010151604051602001610678929190918252602082015260400190565b6040516020818303038152906040528051906020012082600183901c815181106106a4576106a4610d55565b60209081029190910101526106ba600282610cef565b9050610615565b50610222816104d0565b6000600382101580156106df575060408211155b61072b5760405162461bcd60e51b815260206004820152601960248201527f72616e6765206f66206c6f673253697a653a205b332c36345d00000000000000604482015260640161012d565b600083900361074957610742610099600384610d42565b9050610222565b6000610756600384610d42565b6001901b9050600381901b8411156107b05760405162461bcd60e51b815260206004820152601960248201527f6461746120697320626967676572207468616e20647269766500000000000000604482015260640161012d565b6040516306c8e54b60e01b8152600385901c600482015260009073__$981c3d8984149aeea734929c44e255f96b$__906306c8e54b90602401602060405180830381865af4158015610806573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061082a9190610dbd565b610835906002610de0565b60ff16905060008167ffffffffffffffff81111561085557610855610c05565b60405190808252806020026020018201604052801561087e578160200160208202803683370190505b5090506000806000805b86841015610a7057600384901b8a11156108d9576108a78b8b866100d7565b8584815181106108b9576108b9610d55565b6020908102919091010152836108ce81610d6b565b94505083915061098a565b60405163052dcf5f60e31b81526004810185905273__$981c3d8984149aeea734929c44e255f96b$__9063296e7af890602401602060405180830381865af4158015610929573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061094d9190610df9565b905061095881610229565b85848151811061096a5761096a610d55565b60209081029190910101526109826001821b85610cef565b935083811c91505b8261099481610d6b565b9350505b81600116600003610a6b576000856109b1600186610d42565b815181106109c1576109c1610d55565b602002602001015190506000866002866109db9190610d42565b815181106109eb576109eb610d55565b602002602001015190508082604051602001610a11929190918252602082015260400190565b6040516020818303038152906040528051906020012087600287610a359190610d42565b81518110610a4557610a45610d55565b6020908102919091010152610a5b600186610d42565b9450600184901c93505050610998565b610888565b82600114610aae5760405162461bcd60e51b815260206004820152600b60248201526a39ba30b1b59032b93937b960a91b604482015260640161012d565b84600081518110610ac157610ac1610d55565b60200260200101519750505050505050509392505050565b600080600060408486031215610aee57600080fd5b833567ffffffffffffffff80821115610b0657600080fd5b818601915086601f830112610b1a57600080fd5b813581811115610b2957600080fd5b876020828501011115610b3b57600080fd5b6020928301989097509590910135949350505050565b600060208284031215610b6357600080fd5b5035919050565b60008060008060008060a08789031215610b8357600080fd5b86359550602087013594506040870135935060608701359250608087013567ffffffffffffffff80821115610bb757600080fd5b818901915089601f830112610bcb57600080fd5b813581811115610bda57600080fd5b8a60208260051b8501011115610bef57600080fd5b6020830194508093505050509295509295509295565b634e487b7160e01b600052604160045260246000fd5b60006020808385031215610c2e57600080fd5b823567ffffffffffffffff80821115610c4657600080fd5b818501915085601f830112610c5a57600080fd5b813581811115610c6c57610c6c610c05565b8060051b604051601f19603f83011681018181108582111715610c9157610c91610c05565b604052918252848201925083810185019188831115610caf57600080fd5b938501935b82851015610ccd57843584529385019392850192610cb4565b98975050505050505050565b634e487b7160e01b600052601160045260246000fd5b80820180821115610d0257610d02610cd9565b92915050565b60008085851115610d1857600080fd5b83861115610d2557600080fd5b5050820193919092039150565b8183823760009101908152919050565b81810381811115610d0257610d02610cd9565b634e487b7160e01b600052603260045260246000fd5b600060018201610d7d57610d7d610cd9565b5060010190565b8082028115828204841417610d0257610d02610cd9565b600060208284031215610dad57600080fd5b8151801515811461022257600080fd5b600060208284031215610dcf57600080fd5b815160ff8116811461022257600080fd5b60ff8181168382160190811115610d0257610d02610cd9565b600060208284031215610e0b57600080fd5b505191905056fe011b4d03dd8c01f1049143cf9c4c817e4b167f1d1b83e5c6f0f10d89ba1e7bce4d9470a821fbe90117ec357e30bad9305732fb19ddf54a07dd3e29f440619254ae39ce8537aca75e2eff3e38c98011dfe934e700a0967732fc07b430dd656a233fc9a15f5b4869c872f81087bb6104b7d63e6f9ab47f2c43f3535eae7172aa7f17d2dd614cddaa4d879276b11e0672c9560033d3e8453a1d045339d34ba601b9c37b8b13ca95166fb7af16988a70fcc90f38bf9126fd833da710a47fb37a55e68e7a427fa943d9966b389f4f257173676090c6e95f43e2cb6d65f8758111e30930b0b9deb73e155c59740bacf14a6ff04b64bb8e201a506409c3fe381ca4ea90cd5deac729d0fdaccc441d09d7325f41586ba13c801b7eccae0f95d8f3933efed8b96e5b7f6f459e9cb6a2f41bf276c7b85c10cd4662c04cbbb365434726c0a0c9695393027fb106a8153109ac516288a88b28a93817899460d6310b71cf1e6163e8806fa0d4b197a259e8c3ac28864268159d0ac85f8581ca28fa7d2c0c03eb91e3eee5ca7a3da2b3053c9770db73599fb149f620e3facef95e947c0ee860b72122e31e4bbd2b7c783d79cc30f60c6238651da7f0726f767d22747264fdb046f7549f26cc70ed5e18baeb6c81bb0625cb95bb4019aeecd40774ee87ae29ec517a71f6ee264c5d761379b3d7d617ca83677374b49d10aec50505ac087408ca892b573c267a712a52e1d06421fe276a03efb1889f337201110fdc32a81f8e152499af665835aabfdc6740c7e2c3791a31c3cdc9f5ab962f681b12fc092816a62f27d86025599a41233848702f0cfc0437b445682df51147a632a0a083d2d38b5e13e466a8935afff58bb533b3ef5d27fba63ee6b0fd9e67ff20af9d50deee3f8bf065ec220c1fd4ba57e341261d55997f85d66d32152526736872693d2b437a233e2337b715f6ac9a6a272622fdc2d67fcfe1da3459f8dab4ed7e40a657a54c36766c5e8ac9a88b35b05c34747e6507f6b044ab66180dc76ac1a696de03189593fedc0d0dbbd855c8ead673544899b0960e4a5a7ca43b4ef90afe607de7698caefdc242788f654b57a4fb32a71b335ef6ff9a4cc118b282b53bdd6d6192b7a82c3c5126b9c7e33c8e5a5ac9738b8bd31247fb7402054f97b573e8abb9faad219f4fd085aceaa7f542d787ee4196d365f3cc566e7bbcfbfd451230c48d804c017d21e2d8fa914e2559bb72bf0ab78c8ab92f00ef0d0d576eccdd486b64138a4172674857e543d1d5b639058dd908186597e366ad5f3d9c7ceaff44d04d1550b8d33abc751df07437834ba5acb32328a396994aebb3c40f759c2d6d7a3cb5377e55d5d218ef5a296dda8ddc355f3f50c3d0b660a51dfa4d98a6a5a33564556cf83c1373a814641d6a1dcef97b883fee61bb84fe60a3409340217e629cc7e4dcc93b85d8820921ff5826148b60e6939acd7838e1d7f20562bff8ee4b5ec4a05ad997a57b9796fdcb2eda87883c2640b072b140b946bfdf6575cacc066fdae04f6951e63624cbd316a677cad529bbe4e97b9144e4bc06c4afd1de55dd3e1175f90423847a230d34dfb71ed56f2965a7f6c72e6aa33c24c303fd67745d632656c5ef90bec80f4f5d1daa251988826cef375c81c36bf457e09687056f924677cb0bccf98dff81e014ce25f2d132497923e267363963cdf4302c5049d63131dc03fd95f65d8b6aa5934f817252c028c90f56d413b9d5d10d89790707dae2fabb249f649929927c21dd71e3f656826de5451c5da375aadecbd59d5ebf3a31fae65ac1b316a1611f1b276b26530f58d7247df459ce1f86db1d734f6f811932f042cee45d0e455306d01081bc3384f82c5fb2aacaa19d89cdfa46cc916eac61121475ba2e6191b4feecbe1789717021a158ace5d06744b40f551076b67cd63af60007f8c99876e1424883a45ec49d497ddaf808a5521ca74a999ab0b3c7aa9c80f85e93977ec61ce68b20307a1a81f71ca645b568fcd319ccbb5f651e87b707d37c39e15f945ea69e2f7c7d2ccc85b7e654c07e96f0636ae4044fe0e38590b431795ad0f8647bdd613713ada493cc17efd313206380e6a685b8198475bbd021c6e9d94daab2214947127506073e44d5408ba166c512a0b86805d07f5a44d3c41706be2bc15e712e55805248b92e8677d90f6d284d1d6ffaff2c430657042a0e82624fa3717b06cc0a6fd12230ea586dae83019fb9e06034ed2803c98d554b93c9a52348cafff75c40174a91f9ae6b8647854a156029f0b88b83316663ce574a4978277bb6bb27a31085634b6ec78864b6d8201c7e93903d75815067e378289a3d072ae172dafa6a452470f8d645bebfad9779594fc0784bb764a22e3a8181d93db7bf97893c414217a618ccb14caa9e92e8c61673afc9583662e812adba1f87a9c68202d60e909efab43c42c0cb00695fc7f1ffe67c75ca894c3c51e1e5e731360199e600f6ced9a87b2a6a87e70bf251bb5075ab222138288164b2eda727515ea7de12e2496d4fe42ea8d1a120c03cf9c50622c2afe4acb0dad98fd62d07ab4e828a94495f6d1ab973982c7ccbe6c1fae02788e4422ae22282fa49cbdb04ba54a7a238c6fc41187451383460762c06d1c8a72b9cd718866ad4b689e10c9a8c38fe5ef045bd785b01e980fc82c7e3532ce81876b778dd9f1ceeba4478e86411fb6fdd790683916ca832592485093644e8760cd7b4c01dba1ccc82b661bf13f0e3f34acd6b88a2646970667358221220d553b8a21e98b990d99be4bc4197cbb650554a7d21a057b30ef0f54fa5fbc88664736f6c63430008130033";

type MerkleV2ConstructorParams =
  | [linkLibraryAddresses: MerkleV2LibraryAddresses, signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MerkleV2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => {
  return (
    typeof xs[0] === "string" ||
    (Array.isArray as (arg: any) => arg is readonly any[])(xs[0]) ||
    "_isInterface" in xs[0]
  );
};

export class MerkleV2__factory extends ContractFactory {
  constructor(...args: MerkleV2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      const [linkLibraryAddresses, signer] = args;
      super(_abi, MerkleV2__factory.linkBytecode(linkLibraryAddresses), signer);
    }
  }

  static linkBytecode(linkLibraryAddresses: MerkleV2LibraryAddresses): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$981c3d8984149aeea734929c44e255f96b\\$__", "g"),
      linkLibraryAddresses[
        "@cartesi/util/contracts/CartesiMathV2.sol:CartesiMathV2"
      ]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MerkleV2> {
    return super.deploy(overrides || {}) as Promise<MerkleV2>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MerkleV2 {
    return super.attach(address) as MerkleV2;
  }
  override connect(signer: Signer): MerkleV2__factory {
    return super.connect(signer) as MerkleV2__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MerkleV2Interface {
    return new utils.Interface(_abi) as MerkleV2Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MerkleV2 {
    return new Contract(address, _abi, signerOrProvider) as MerkleV2;
  }
}

export interface MerkleV2LibraryAddresses {
  ["@cartesi/util/contracts/CartesiMathV2.sol:CartesiMathV2"]: string;
}
