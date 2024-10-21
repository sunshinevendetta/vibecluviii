import React, { useState, useEffect } from 'react';
import { useAddress, useContract, Web3Button } from '@thirdweb-dev/react';
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../consts/addresses";

export default function ClaimRewards() {
  const address = useAddress();
  const { contract: nftContract } = useContract(NFT_CONTRACT_ADDRESS);
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const [nfts, setNfts] = useState<any[]>([]);
  const [claimedRewards, setClaimedRewards] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchNFTs = async () => {
      if (nftContract && address) {
        try {
          const nftData = await nftContract.erc1155.getOwned(address);
          console.log("NFT Data:", nftData);
          setNfts(nftData);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        }
      }
    };

    fetchNFTs();
  }, [nftContract, address]);

  const calculateClaimableReward = (tokenId: string, quantity: number, price: number) => {
    const claimed = claimedRewards[tokenId] || 0;
    const unclaimedQuantity = quantity - claimed;
    const rewardAmount = unclaimedQuantity * price * 0.1;
    console.log(`Reward for token ${tokenId}: ${rewardAmount}`);
    return rewardAmount;
  };

  const handleClaimSuccess = (tokenId: string, quantityClaimed: number, rewardAmount: number) => {
    setClaimedRewards((prev) => ({
      ...prev,
      [tokenId]: (prev[tokenId] || 0) + quantityClaimed,
    }));
    alert(`Rewards claimed successfully! You received ${rewardAmount.toFixed(2)} tokens.`);
  };

  return (
    <div className={customStyles.customContainer}>
      <h1>Claim Your Rewards</h1>
      <div className={customStyles.nftList}>
        {nfts.map((nft) => {
          const { metadata, quantityOwned } = nft;
          const price = parseFloat(metadata.price || "0");
          const rewardAmount = calculateClaimableReward(metadata.id, quantityOwned, price);

          if (rewardAmount <= 0) {
            return null;
          }

          return (
            <div key={metadata.id} className={customStyles.nftItem}>
              <img src={metadata.image} alt={metadata.name} className={customStyles.tokenImage} />
              <p>{metadata.name}</p>
              <p>Owned: {quantityOwned}</p>
              <p>Claimable Reward: ${rewardAmount.toFixed(2)}</p>
              <Web3Button
                contractAddress={TOKEN_CONTRACT_ADDRESS}
                action={async (contract) => {
                  if (!address) {
                    throw new Error("Address not found.");
                  }
                  const quantityToClaim = quantityOwned - (claimedRewards[metadata.id] || 0);
                  await contract.erc20.transfer(address, rewardAmount);
                }}
                onSuccess={() => handleClaimSuccess(metadata.id, quantityOwned - (claimedRewards[metadata.id] || 0), rewardAmount)}
                className={customStyles.claimButton}
              >
                Claim {rewardAmount.toFixed(2)} Rewards
              </Web3Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
