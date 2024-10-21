'use client';
import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { RiTwitterLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import styles from '../styles/Invite.module.css'; // Import the custom CSS file

const InvitePage: React.FC = () => {
    const [timer, setTimer] = useState<number | null>(null);
    const [invitedViaSocial, setInvitedViaSocial] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let countdown: NodeJS.Timeout;
        if (timer !== null) {
            countdown = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer && prevTimer > 0) {
                        return prevTimer - 1;
                    } else {
                        clearInterval(countdown);
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [timer]);

    useEffect(() => {
        if (timer === 0) {
            router.push('/home'); // Redirect to home or index page after timer ends
        }
    }, [timer, router]);

    const shareText = `Join me as a member of OnChain Sports and be part of the future of sports! Connect with other enthusiasts and enjoy exclusive benefits.`;

    const handleSocialShare = (platform: string) => {
        setInvitedViaSocial(true); // Mark as invited via social media
        setTimer(15); // Start 15 seconds timer for social share
        const url = encodeURIComponent('https://onchainsports.com'); // Replace with your actual URL

        switch (platform) {
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/share?url=${url}&text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'telegram':
                window.open(`https://telegram.me/share/url?url=${url}&text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            default:
                break;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Be a Member of OnChain Sports</h2>
                <p className={styles.description}>
                    Share with others to join the future of sports and get extra tokens and benefits
                </p>
                <div className={styles.icons}>
                    <button onClick={() => handleSocialShare('facebook')} className={styles.iconButton}>
                        <FaFacebookF className={styles.icon} />
                    </button>
                    <button onClick={() => handleSocialShare('twitter')} className={styles.iconButton}>
                        <RiTwitterLine className={styles.icon} />
                    </button>
                    <button onClick={() => handleSocialShare('linkedin')} className={styles.iconButton}>
                        <FaLinkedinIn className={styles.icon} />
                    </button>
                    <button onClick={() => handleSocialShare('whatsapp')} className={styles.iconButton}>
                        <FaWhatsapp className={styles.icon} />
                    </button>
                    <button onClick={() => handleSocialShare('telegram')} className={styles.iconButton}>
                        <FaTelegramPlane className={styles.icon} />
                    </button>
                </div>
                {invitedViaSocial && timer !== null && (
                    <p className={styles.timerText}>Redirecting in {timer} seconds...</p>
                )}
            </div>
        </div>
    );
};

export default InvitePage;
