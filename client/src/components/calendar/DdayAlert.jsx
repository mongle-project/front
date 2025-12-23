import React from "react";
import styles from "./DdayAlert.module.css";

const DdayAlert = ({ daysRemaining, label, pet, date }) => {
  return (
    <div className={styles.alert}>
      <div className={styles.alertTop}>
        <span className={styles.badge}>다가오는 일정</span>
      </div>
      <div className={styles.titleRow}>
        <p className={styles.title}>{label}</p>
        <span className={styles.petChip}>{pet}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.dday}>D-{daysRemaining}</span>
        <span className={styles.date}>{date}</span>
      </div>
    </div>
  );
};

export default DdayAlert;
