import { ContractName } from "~~/utils/scaffold-eth/contract";
import { useProvider, useContract } from "wagmi";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { ethers } from "ethers";

/**
 * @dev Gets a deployed contract from contractName and returns a contract instance
 * @param config - The config settings
 * @param config.contractName - Deployed contract name
 * @param config.signerOrProvider - An ethers Provider or Signer (optional)
 */
export const useScaffoldContract = <
    TContractName extends ContractName,
>({
    contractName,
    signerOrProvider,
}: {
    contractName: TContractName;
    signerOrProvider?: ethers.Signer | ethers.providers.Provider;
}) => {
    const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(contractName);
    const provider = useProvider();

    const contract = useContract({
        address: deployedContractData?.address,
        abi: deployedContractData?.abi,
        signerOrProvider: signerOrProvider === undefined ? provider : signerOrProvider,
    });

    return {
        data: contract,
        isLoading: deployedContractLoading,
    }
};