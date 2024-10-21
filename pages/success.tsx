import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';
import customStyles from '../styles/Success.module.css';

export default function Success() {
  const router = useRouter();
  const { foodTokenId, drinkTokenId, seatNumber, quantity, drinkQuantity, transactionHash } = router.query;
  const [timer, setTimer] = useState<number>(30); // 30-second timer for demo
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(false);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1 && notificationEnabled) {
          notifyUser();
        }
        if (prev === 0) {
          clearInterval(countdown); // Stop the timer
          setTimerExpired(true); // Indicate that the timer has expired
          return prev;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [notificationEnabled]);

  useEffect(() => {
    // Request permission for notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        }
      });
    }
  }, []);

  const notifyUser = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([500, 300, 500]); // Vibrate pattern
    }
    new Notification('Order Alert', {
      body: 'Your order is arriving!',
    });
  };

  const generateQRCodeData = (item: string, index: number) => {
    return `https://example.com/verify?tokenId=${item}&seatNumber=${seatNumber}&item=${index}`;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleOrderAgain = () => {
    router.push('/foods'); // Redirect to the food ordering page
  };

  const handleClaimRewards = () => {
    router.push('/claimrewards'); // Redirect to the rewards collection page
  };

  const handleViewTransaction = () => {
    const blockscoutUrl = `https://base-sepolia.blockscout.com/tx/${transactionHash}`;
    window.open(blockscoutUrl, '_blank');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Order Confirmed!</h1>
      <p>Your seat number is: {seatNumber}</p>
      <p className={timerExpired ? customStyles.blinkingTimer : ''}>
        Estimated delivery time: {formatTime(timer)}
      </p>
      <div className={customStyles.qrContainer}>
        {Array.from({ length: Number(quantity) }).map((_, index) => (
          <div key={index} className={customStyles.qrItem}>
            <QRCode value={generateQRCodeData(foodTokenId as string, index + 1)} />
            <p>Food Item {index + 1}</p>
          </div>
        ))}
        {drinkTokenId &&
          Array.from({ length: Number(drinkQuantity) }).map((_, index) => (
            <div key={index} className={customStyles.qrItem}>
              <QRCode value={generateQRCodeData(drinkTokenId as string, index + 1)} />
              <p>Drink Item {index + 1}</p>
            </div>
          ))}
      </div>
      <div style={{ margin: '20px 0' }}>
        <label>
          <input
            type="checkbox"
            checked={notificationEnabled}
            onChange={() => setNotificationEnabled(!notificationEnabled)}
          />
          Enable notification when the timer ends
        </label>
      </div>
      <div className={customStyles.buttonContainer}>
        <button onClick={handleOrderAgain} className={customStyles.actionButton}>Order Again</button>
        <button onClick={handleClaimRewards} className={customStyles.actionButton}>Claim Rewards</button>
        <button onClick={handleViewTransaction} className={customStyles.actionButton}>View on Blockscout</button>
      </div>
    </div>
  );
}
