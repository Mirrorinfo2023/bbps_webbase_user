'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Redeem.module.css';

const RedeemPage = () => {
  const router = useRouter();
  const [showAllHistory, setShowAllHistory] = useState(false);

  const bonusData = {
    daily: [
      { amount: 36.00 },
      { amount: 112.50 },
      { amount: 135.00 },
      { amount: 157.50 }
    ],
    other: [
      { label: 'Daily profit Bonus Points', amount: 0.09 },
      { label: 'Referral Bonus Points', amount: 0.59 }
    ]
  };

  const redeemHistory = [
    {
      id: 1,
      date: '01-10-2025 16:29:03',
      amount: 11060,
      status: 'Improcess',
      message: 'It Will be credited in next 24 hours till 02 Oct 2025, 04:29 PM'
    },
    {
      id: 2,
      date: '12-08-2025 08:56:21',
      amount: 17741,
      status: 'Success',
      message: 'Your Amount is credited Successfully'
    },
    {
      id: 3,
      date: '28-07-2025 20:50:54',
      amount: 5922,
      status: 'Success'
    }
  ];

  const displayedHistory = showAllHistory ? redeemHistory : redeemHistory.slice(0, 2);

  const totalPoints = bonusData.daily.reduce((sum, item) => sum + item.amount, 0) +
                     bonusData.other.reduce((sum, item) => sum + item.amount, 0);

  const handleIndividualRedeem = (amount, type) => {
    alert(`Redeeming ${amount.toFixed(2)} points from ${type}`);
  };

  const handleTotalRedeem = () => {
    alert(`Redeeming all ${totalPoints.toFixed(2)} points`);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={() => router.back()}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className={styles.title}>My Redeem</h1>
        <div className={styles.headerActions}></div>
      </div>

      <div className={styles.content}>
        

        {/* Bonus Points Section with Individual Redeem Buttons */}
        <div className={styles.bonusSection}>
          {/* Daily Bonus Points */}
          <div className={styles.bonusCategory}>
            <h2 className={styles.categoryTitle}>Daily Bonus Points</h2>
            <div className={styles.bonusList}>
              {bonusData.daily.map((item, index) => (
                <div key={index} className={styles.bonusItem}>
                  <span className={styles.emailIcon}>📧</span>
                  <span className={styles.bonusAmount}>{item.amount.toFixed(2)}</span>
                  <button 
                    className={styles.individualRedeemBtn}
                    onClick={() => handleIndividualRedeem(item.amount, 'Daily Bonus')}
                  >
                    Redeem Now
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Other Bonus Points */}
          <div className={styles.bonusCategory}>
            {bonusData.other.map((item, index) => (
              <div key={index} className={styles.otherBonusItem}>
                <h3 className={styles.otherBonusTitle}>{item.label}</h3>
                <div className={styles.bonusItem}>
                  <span className={styles.emailIcon}>📧</span>
                  <span className={styles.bonusAmount}>{item.amount.toFixed(2)}</span>
                  <button 
                    className={styles.individualRedeemBtn}
                    onClick={() => handleIndividualRedeem(item.amount, item.label)}
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Line Separator */}
        <div className={styles.separator}></div>

        {/* Redeem History Section */}
        <div className={styles.historySection}>
          <h2 className={styles.historyTitle}>Redeem History</h2>
          
          <div className={styles.historyList}>
            {displayedHistory.map((item, index) => (
              <div key={item.id} className={styles.historyItem}>
                {/* Date */}
                <div className={styles.historyDate}>Date {item.date}</div>
                
                {/* Amount with icon */}
                <div className={styles.amountSection}>
                  <span className={styles.amountIcon}>💬️</span>
                  <strong className={styles.amountText}>Redeem Amount {item.amount.toLocaleString()}</strong>
                </div>
                
                {/* Status */}
                {item.status && (
                  <div className={styles.statusSection}>
                    <strong>Status : {item.status}</strong>
                  </div>
                )}
                
                {/* Message */}
                {item.message && (
                  <div className={styles.message}>
                    {item.message}
                  </div>
                )}

                {/* Separator line between items (except last) */}
                {index < displayedHistory.length - 1 && (
                  <div className={styles.itemSeparator}></div>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {redeemHistory.length > 2 && (
            <button 
              className={styles.toggleButton}
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? 'Show Less' : 'Show More History'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemPage;