// food.tsx
import { useAddress, useContract } from "@thirdweb-dev/react";
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS } from "../consts/addresses";
import NFTCard from "../components/nft-card";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Modal from 'react-modal';

export default function NFTs() {
  const address = useAddress();
  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const [allNFTs, setAllNFTs] = useState<any[]>([]);
  const [allNFTsLoading, setAllNFTsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [seatNumber, setSeatNumber] = useState<string | null>(null);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const foodTokenIds = ["4", "5", "6"]; // Food token IDs

  useEffect(() => {
    async function fetchNFTData() {
      if (contract && address) {
        try {
          const nfts = await contract.erc1155.getAll();
          const nftsWithOwnership = await Promise.all(
            nfts.map(async (nft: any) => {
              const quantityOwned = await contract.erc1155.balanceOf(address, nft.metadata.id);
              return { ...nft, quantityOwned: quantityOwned.toNumber() };
            })
          );
          setAllNFTs(nftsWithOwnership);
        } catch (error) {
          console.error("Error fetching NFTs:", error);
        } finally {
          setAllNFTsLoading(false);
        }
      }
    }

    fetchNFTData();
  }, [contract, address]);

  const handleDrinkDecision = (decision: string) => {
    setIsModalOpen(false);
    if (seatNumber && selectedTokenId) {
      if (decision === 'yes') {
        router.push({
          pathname: '/drinks',
          query: {
            foodTokenId: selectedTokenId,
            quantity,
            seatNumber,
          },
        });
      } else {
        router.push({
          pathname: '/checkout',
          query: {
            foodTokenId: selectedTokenId,
            quantity,
            seatNumber,
          },
        });
      }
    } else {
      alert('Please select a food item and enter your seat number.');
    }
  };

  const openDrinkModal = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setIsModalOpen(true);
  };

  return (
    <div className={customStyles.customContainer}>
      <h1>Food Menu</h1>
      {allNFTsLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={customStyles.grid}>
          {foodTokenIds.map((tokenId) => {
            const nft = allNFTs.find((nft) => nft.metadata.id === tokenId);
            return (
              <div key={tokenId} className={customStyles.ticketContainer}>
                <NFTCard nft={nft} quantity={nft?.quantityOwned || 0} />
                <div>
                  <label htmlFor="quantity">Quantity: </label>
                  <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
                    min="1"
                  />
                </div>
                <div>
                  <label htmlFor="seatNumber">Seat Number: </label>
                  <input
                    type="text"
                    id="seatNumber"
                    value={seatNumber ?? ''}
                    onChange={(e) => setSeatNumber(e.target.value)}
                    placeholder="Enter your seat number"
                  />
                </div>
                <button onClick={() => openDrinkModal(tokenId)} className={customStyles.buyButton}>
                  Select {nft?.metadata.name}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={customStyles.modal}
        overlayClassName={customStyles.overlay}
        contentLabel="Add Drink Modal"
        ariaHideApp={false} // Use this if you don't need accessibility support
      >
        <h2>Would you like to add a drink?</h2>
        <div className={customStyles.modalButtons}>
          <button onClick={() => handleDrinkDecision('yes')} className={customStyles.yesButton}>Yes</button>
          <button onClick={() => handleDrinkDecision('no')} className={customStyles.noButton}>No</button>
        </div>
      </Modal>
    </div>
  );
}