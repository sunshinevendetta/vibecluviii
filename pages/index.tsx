'use client';
import React, { useState, useEffect } from 'react';
import {
  ConnectWallet,
  MediaRenderer,
  Web3Button,
  useAddress,
  useContract,
  useContractMetadata,
  useNFTBalance,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import { NFT_CONTRACT_ADDRESS } from '../consts/addresses';
import styles from '../styles/Home.module.css';
import { NextPage } from 'next';
import ThreeScene from '../components/3dlogo'; 

const Home: NextPage = () => {
  const address = useAddress();
  const router = useRouter();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  const { contract } = useContract(NFT_CONTRACT_ADDRESS);
  const { data: contractMetadata } = useContractMetadata(contract);
  const { data: nftBalance } = useNFTBalance(contract, address, 0); // assuming token ID is 0

  useEffect(() => {
    if (nftBalance && nftBalance.gt(0)) {
      setHasClaimedNFT(true);
    }
  }, [nftBalance]);

  const handleClaimSuccess = () => {
    alert('Congrats! NFT Claimed! Now claim your free tokens.');
    router.push('/nfts');
  };

  return (
    <div className={styles.container}>
      {address ? (
        <div className={styles.nftClaim}>
          <MediaRenderer
            src={contractMetadata?.image}
            width="auto"
            height="60%"
            style={{
              borderRadius: '20px',
              maxWidth: '500px',
            }}
          />
          <h1 className={styles.centeredText}>{contractMetadata?.name}</h1>
          {hasClaimedNFT ? (
            <button
              className={styles.redirectButton}
              onClick={() => router.push('/nfts')}
            >
              Claim Tokens
            </button>
          ) : (
            <Web3Button
              contractAddress={NFT_CONTRACT_ADDRESS}
              action={(contract) => contract.erc1155.claim(0, 1)}
              onSuccess={handleClaimSuccess}
            >
              Claim Badge
            </Web3Button>
          )}
        </div>
      ) : (
        <div className={styles.fullScreenCenter}>
          <div className={styles.customLogoContainer}>
            <ThreeScene /> {/* 3D element is placed here */}
          </div>
          <ConnectWallet btnTitle="Login" />
        </div>
      )}
    </div>
  );
};

export default Home;
