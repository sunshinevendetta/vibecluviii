'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';
import { FaTicketAlt, FaHome, FaBars, FaTimes } from 'react-icons/fa';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdRestaurantMenu } from 'react-icons/md'; // For Food
import { GiSodaCan } from 'react-icons/gi'; // For Drinks and Merch
import { CgMusicSpeaker } from 'react-icons/cg';
import { SiEthereum } from 'react-icons/si'; // For Badges
import styles from '../styles/Home.module.css';

export default function Header() {
  const address = useAddress();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link href="/">
          <Image src="/logo.gif" alt="Power Frens Logo" width={128} height={24} className={styles.logoImage} />
        </Link>
        <p className={styles.siteTitle}>vibecluv</p>
      </div>
      <nav className={`${styles.navContainer} ${menuOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.navButton}>
          <FaHome className={styles.icon} />
          Home
        </Link>
        <Link href="/tickets" className={styles.navButton}>
          <FaTicketAlt className={styles.icon} />
          Tickets
        </Link>
        <Link href="/food" className={styles.navButton}>
          <MdRestaurantMenu className={styles.icon} />
          Food
        </Link>
        <Link href="/drinks" className={styles.navButton}>
          <GiSodaCan className={styles.icon} />
          Drinks
        </Link>
        <Link href="/artists" className={styles.navButton}>
          <CgMusicSpeaker className={styles.icon} />
          Artists
        </Link>
        <Link href="/nfts" className={styles.navButton}>
          <SiEthereum className={styles.icon} />
          Badges
        </Link>
        <Link href="/invite" className={styles.navButton} target="_blank" rel="noopener noreferrer">
          <AiOutlineUserAdd className={styles.icon} />
          Invite
        </Link>
      </nav>
      <button className={styles.menuButton} onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}
