import React, { useState } from 'react';
import { useAddress, useContract, Web3Button } from '@thirdweb-dev/react';
import customStyles from "../styles/CustomCard.module.css";
import { TOKEN_CONTRACT_ADDRESS } from "../consts/addresses";
import { useRouter } from 'next/router';

export default function ClaimRewards() {
  const address = useAddress();
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const [claimed, setClaimed] = useState(false); // Track if rewards have been claimed
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleClaimSuccess = () => {
    setClaimed(true); // Disable the button after claiming
    setSuccessMessage("Rewards claimed successfully! You received 50 tokens.");
  };

  const handleInviteClick = () => {
    router.push('/invite');
  };

  const handleOrderAgainClick = () => {
    router.push('/order');
  };

  return (
    <div className={customStyles.customContainer}>
      <h1>Claim Your Rewards</h1>
      
      {/* Centered Claim Button */}
      <div className={customStyles.buttonContainer}>
        <Web3Button
          contractAddress={TOKEN_CONTRACT_ADDRESS}
          action={async (contract) => {
            if (address) {
              await contract.erc20.transfer(address, 50); // Claim fixed 50 reward tokens
            } else {
              throw new Error("Address is not available");
            }
          }}
          onSuccess={handleClaimSuccess}
          onError={(error) => console.error("Error claiming rewards:", error.message)}
          className={`${customStyles.claimButton} ${claimed && customStyles.disabledButton}`}
          isDisabled={claimed} // Disable the button after claiming
        >
          {claimed ? "Already Claimed 50 Reward Tokens" : "Claim 50 Reward Tokens"}
        </Web3Button>
      </div>

      {/* Success Message */}
      {successMessage && <p className={customStyles.successMessage}>{successMessage}</p>}

      {/* Order Again and Invite Friends Buttons */}
      {claimed && (
        <div className={customStyles.additionalActions}>
          <button className={customStyles.orderButton} onClick={handleOrderAgainClick}>
            Order Again
          </button>
          <button className={customStyles.inviteButton} onClick={handleInviteClick}>
            Invite Friends to Get More Rewards
          </button>
        </div>
      )}
    </div>
  );
}
