"use client";

import AlumniRegistrationForm from "@/components/Register/AlumniRegistrationForm";
import CorporateRegistrationForm from "@/components/Register/CorporateRegistrationForm";
import RegistrationDialog from "@/components/Register/RegistrationDialog";
import styles from "@/styles/Register/index.module.css";
import { useState } from "react";

type AccountType = "alumni" | "corporate";

export default function RegistrationPage() {
  const [accountType, setAccountType] = useState<AccountType>("alumni");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [backHome, setbackHome] = useState(true);

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  return (
    <div
      className={`${styles.container} border-black border border-opacity-30`}
    >
      <RegistrationDialog
        isOpen={isOpenDialog}
        title={title}
        message={message}
        backHome={backHome}
      />
      <header className={styles.header}>
        <h1>申請驗證</h1>
        <p className={styles.description}>
          請填寫以下資料完成申請，帶 * 符號為必填欄位
        </p>
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
        <AlumniRegistrationForm
          setIsOpenDialog={setIsOpenDialog}
          setTitle={setTitle}
          setMessage={setMessage}
          setbackHome={setbackHome}
        />
      ) : (
        <CorporateRegistrationForm
          setIsOpenDialog={setIsOpenDialog}
          setTitle={setTitle}
          setMessage={setMessage}
          setbackHome={setbackHome}
        />
      )}
    </div>
  );
}
