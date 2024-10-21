// pages/nfts.tsx
import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS } from "../consts/addresses";
import NFTCard from "../components/nft-card";
import ClaimToken from "../components/claimToken";

export default function NFTs() {
  const address = useAddress();
  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const { data: ownedNFTs, isLoading: ownedNFTsLoading } = useOwnedNFTs(contract, address);

  return (
    <div className={customStyles.customContainer}>
      <h1>Badges/Medallas</h1>
      {ownedNFTsLoading ? (
        <p>Loading...</p>
      ) : ownedNFTs && ownedNFTs.length > 0 ? (
        <div className={customStyles.grid}>
          {ownedNFTs.map((nft) => (
            <NFTCard
              key={nft.metadata.id}
              nft={nft}
              quantity={parseInt(nft.quantityOwned!)}
            />
          ))}
          <ClaimToken />
        </div>
      ) : (
        <p>No badges owned</p>
      )}
    </div>
  );
}
