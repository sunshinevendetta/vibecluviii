// custom.d.ts
declare namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
  
  declare module '@thirdweb-dev/sdk/node_modules/thirdweb/dist/types/contract/contract' {
    import { Abi, ContractOptions, ThirdwebContract } from '@thirdweb-dev/sdk';
    export function getContract<AbiType extends Abi = []>(options: ContractOptions<AbiType>): ThirdwebContract<AbiType>;
  }
  