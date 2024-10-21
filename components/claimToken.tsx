// components/claimToken.tsx
import React, { useState } from 'react';
import { Web3Button, useAddress, useContract, useTokenBalance } from '@thirdweb-dev/react';
import Image from 'next/image';
import styles from "../styles/CustomCard.module.css"; // Adjust path according to your structure

const TOKEN_CONTRACT_ADDRESS = '0xA3E54F76C212B0C7dd131B25a38E2824E74B1C12';

const App = () => {
  const address = useAddress();
  const { contract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const { data: tokenBalance } = useTokenBalance(contract, address);
  const [successMessage, setSuccessMessage] = useState("");

  const handleClaimSuccess = () => {
    setSuccessMessage("Tokens claimed successfully! Invite more friends to earn more tokens.");
  };

  return (
    <div className={styles.customContainer}>
      <div className={styles.glassCard}>
        <div className={styles.nftMediaContainer1}>
          <Image src="/token.png" alt="Token Image" layout="responsive" width={500} height={500} className={styles.nftImage} />
        </div>
        <h2>Tokens Balance:</h2>
        <p>{tokenBalance?.displayValue}</p>
        <Web3Button
          contractAddress={TOKEN_CONTRACT_ADDRESS}
          action={(contract) => contract.erc20.claim(1000)}
          onSuccess={handleClaimSuccess}
        >
          Claim FREE Tokens
        </Web3Button>
        {successMessage && <p>{successMessage}</p>}
      </div>
    </div>
  );
};

export default App;
