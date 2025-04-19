"use client";

import { useState } from "react";
import styles from "@/styles/Register/index.module.css";
import AlumniRegistrationForm from "@/components/Register/AlumniRegistrationForm";
import CorporateRegistrationForm from "@/components/Register/CorporateRegistrationForm";

type AccountType = "alumni" | "corporate";

export default function RegistrationPage() {
  const [accountType, setAccountType] = useState<AccountType>("alumni");

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>申請驗證</h1>
        <p className={styles.description}>請填寫以下資料完成申請，帶 * 符號為必填欄位</p>
      </header>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${accountType === "alumni" ? styles.active : ""}`}
          onClick={() => handleAccountTypeChange("alumni")}
        >
          校友帳號
        </button>
        <button
          className={`${styles.tabButton} ${accountType === "corporate" ? styles.active : ""}`}
          onClick={() => handleAccountTypeChange("corporate")}
        >
          企業帳號
        </button>
      </div>

      {accountType === "alumni" ? (
        <AlumniRegistrationForm />
      ) : (
        <CorporateRegistrationForm />
      )}
    </div>
  );
}