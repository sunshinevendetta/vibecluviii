import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Web3Button } from '@thirdweb-dev/react';
import customStyles from "../styles/CustomCard.module.css";
import { NFT_CONTRACT_ADDRESS } from "../consts/addresses";
import { useContract } from "@thirdweb-dev/react";

interface TokenMetadata {
  name: string;
  image: string;
}

export default function Checkout() {
  const router = useRouter();
  const { foodTokenId, quantity, seatNumber, drinkTokenId, drinkQuantity } = router.query;
  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const [foodMetadata, setFoodMetadata] = useState<TokenMetadata | null>(null);
  const [drinkMetadata, setDrinkMetadata] = useState<TokenMetadata | null>(null);

  useEffect(() => {
    const fetchMetadata = async (tokenId: string, setMetadata: (metadata: TokenMetadata | null) => void) => {
      if (contract) {
        try {
          const metadata = await contract.erc1155.get(tokenId);
          setMetadata({
            name: String(metadata.metadata.name || ''), // Cast to string
            image: String(metadata.metadata.image || ''), // Cast to string
          });
        } catch (error) {
          console.error("Error fetching metadata:", error);
          setMetadata(null);
        }
      }
    };

    if (foodTokenId) {
      fetchMetadata(foodTokenId as string, setFoodMetadata);
    }

    if (drinkTokenId) {
      fetchMetadata(drinkTokenId as string, setDrinkMetadata);
    }
  }, [contract, foodTokenId, drinkTokenId]);

  const handleCheckoutSuccess = () => {
    router.push({
      pathname: '/success',
      query: {
        foodTokenId,
        quantity,
        seatNumber,
        drinkTokenId: drinkTokenId || null,
        drinkQuantity: drinkQuantity || 0,
      },
    });
  };

  return (
    <div className={customStyles.customContainer}>
      <h1>Checkout</h1>
      <div className={customStyles.orderSummary}>
        {foodMetadata && (
          <div className={customStyles.itemColumn}>
            <img src={foodMetadata.image} alt={foodMetadata.name} className={customStyles.tokenImage} />
            <p>Food Item: {foodMetadata.name}</p>
            <p>Quantity: {quantity}</p>
          </div>
        )}
        {drinkMetadata && (
          <div className={customStyles.itemColumn}>
            <img src={drinkMetadata.image} alt={drinkMetadata.name} className={customStyles.tokenImage} />
            <p>Drink Item: {drinkMetadata.name}</p>
            <p>Quantity: {drinkQuantity}</p>
          </div>
        )}
        <div className={customStyles.seatInfo}>
          <p>Seat Number: {seatNumber}</p>
        </div>
      </div>
      <Web3Button
        contractAddress={NFT_CONTRACT_ADDRESS}
        action={async (contract) => {
          await contract.erc1155.claim(foodTokenId as string, parseInt(quantity as string));
          if (drinkTokenId) {
            await contract.erc1155.claim(drinkTokenId as string, parseInt(drinkQuantity as string));
          }
        }}
        onSuccess={handleCheckoutSuccess}
        className={customStyles.payButton}
      >
        Confirm and Pay
      </Web3Button>
    </div>
  );
}
