import { useAddress, useContract } from "@thirdweb-dev/react";
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS } from "../consts/addresses";
import NFTCard from "../components/nft-card";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function Drinks() {
  const address = useAddress();
  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const [allNFTs, setAllNFTs] = useState<any[]>([]);
  const [allNFTsLoading, setAllNFTsLoading] = useState(true);
  const [drinkQuantity, setDrinkQuantity] = useState(1);
  const [seatNumber, setSeatNumber] = useState<string | null>(null);
  const router = useRouter();

  const drinkTokenIds = ["7", "8", "9"]; // Example drink token IDs
  const { foodTokenId, quantity } = router.query;

  useEffect(() => {
    // Check if seat number is already provided in the query (coming from the Foods page)
    if (router.query.seatNumber) {
      setSeatNumber(router.query.seatNumber as string);
    }

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
  }, [contract, address, router.query.seatNumber]);

  const handleAddToCheckout = (drinkTokenId: string) => {
    if (!seatNumber) {
      alert('Please enter your seat number.');
      return;
    }

    router.push({
      pathname: '/checkout',
      query: {
        foodTokenId,
        quantity,
        seatNumber,
        drinkTokenId,
        drinkQuantity,
      },
    });
  };

  return (
    <div className={customStyles.customContainer}>
      <h1>Drinks Menu</h1>
      {allNFTsLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={customStyles.grid}>
          {drinkTokenIds.map((tokenId) => {
            const nft = allNFTs.find((nft) => nft.metadata.id === tokenId);
            return (
              <div key={tokenId} className={customStyles.ticketContainer}>
                <NFTCard nft={nft} quantity={nft?.quantityOwned || 0} />
                <div>
                  <label htmlFor="drinkQuantity">Quantity: </label>
                  <input
                    type="number"
                    id="drinkQuantity"
                    value={drinkQuantity}
                    onChange={(e) => setDrinkQuantity(Math.max(1, parseInt(e.target.value)))}
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
                <button onClick={() => handleAddToCheckout(tokenId)} className={customStyles.addButton}>
                  Add to Checkout
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
