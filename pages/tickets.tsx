import { useAddress, useContract, useOwnedNFTs, Web3Button } from "@thirdweb-dev/react";
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS } from "../consts/addresses";
import NFTCard from "../components/nft-card";
import { useEffect, useState } from "react";
import { NFT as ThirdwebNFT } from "@thirdweb-dev/sdk";

// Define the token IDs you want to allow purchases for
const tokenIds = ["0", "1", "2", "3"];

export default function Tickets() {
  const address = useAddress();
  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading: ownedNFTsLoading } = useOwnedNFTs(contract, address);
  const [allNFTs, setAllNFTs] = useState<ThirdwebNFT[]>([]); // Store all NFTs including those not owned

  useEffect(() => {
    // Fetch all NFTs that match the specified token IDs
    const fetchNFTs = async () => {
      if (contract) {
        try {
          const nfts = await Promise.all(
            tokenIds.map(async (tokenId) => {
              const nft = await contract.erc1155.get(tokenId);
              return nft;
            })
          );
          setAllNFTs(nfts);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchNFTs();
  }, [contract]);

  const handlePurchaseSuccess = (tokenId: string) => {
    alert(`Successfully purchased ticket for Token ID ${tokenId}!`);
  };

  const renderNFTCard = (nft: ThirdwebNFT, quantityOwned: number) => (
    <div key={nft.metadata.id} className={customStyles.ticketContainer}>
      <NFTCard nft={nft} quantity={quantityOwned} />
      <div className={customStyles.purchaseOptions}>
        <Web3Button
          contractAddress={NFT_CONTRACT_ADDRESS}
          action={(contract) => contract.erc1155.claim(nft.metadata.id, 1)}
          onSuccess={() => handlePurchaseSuccess(nft.metadata.id)}
          className={customStyles.buyButton}
        >
          Buy More Tickets
        </Web3Button>
      </div>
    </div>
  );

  return (
    <div className={customStyles.customContainer}>
      <h1>Tickets</h1>
      {ownedNFTsLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={customStyles.grid}>
          {allNFTs.map((nft) => {
            const ownedNFT = ownedNFTs?.find((owned) => owned.metadata.id === nft.metadata.id);
            const quantityOwned = ownedNFT ? parseInt(ownedNFT.quantityOwned!) : 0;
            return renderNFTCard(nft, quantityOwned);
          })}
        </div>
      )}
    </div>
  );
}
