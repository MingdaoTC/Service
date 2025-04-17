"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import styles from "@/styles/Register/index.module.css";

type AccountType = "alumni" | "corporate";
type UploadedFile = File;

export default function RegistrationPage() {
  const [accountType, setAccountType] = useState<AccountType>("alumni");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(filesArray);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 處理表單提交邏輯
    alert("表單已提交！在實際應用中，這裡會處理表單資料並傳送到伺服器。");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>註冊申請</h1>
        <p className={styles.description}>請填寫以下資料完成註冊，帶 * 符號為必填欄位</p>
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

      <form id="registration-form" className={styles.form} onSubmit={handleSubmit}>
        <input type="hidden" id="account-type" name="accountType" value={accountType} />

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.required}>Email</label>
          <input type="email" id="email" name="email" required />
          <p className={styles.helpText}>此 Email 將作為您的登入帳號</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.required}>姓名</label>
          <input type="text" id="name" name="name" required />
          <p className={styles.helpText}>
            {accountType === "alumni" ? "請填寫您的真實姓名" : "請填寫負責人員姓名"}
          </p>
        </div>

        {accountType === "corporate" && (
          <div className={styles.formGroup}>
            <label htmlFor="company" className={styles.required}>公司名稱</label>
            <input type="text" id="company" name="company" required />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.required}>手機號碼</label>
          <input type="tel" id="phone" name="phone" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="id-document" className={styles.required}>身份驗證文件上傳</label>
          <div className={styles.fileUpload}>
            <label htmlFor="id-document" className={styles.fileUploadLabel}>
              <span className={styles.fileUploadIcon}>📎</span>
              <span>點擊上傳文件（學生證、身分證、護照正反面）</span>
            </label>
            <input
              type="file"
              id="id-document"
              name="idDocument"
              accept="image/*,.pdf"
              multiple
              required
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.uploadedFiles}>
            {uploadedFiles.map((file, index) => (
              <div key={index} className={styles.uploadedFile}>
                <span>{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className={styles.removeButton}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <p className={styles.helpText}>請上傳清晰可辨識的證件照片，支援 JPG、PNG、PDF 格式</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="notes">備註</label>
          <textarea id="notes" name="notes" rows={4}></textarea>
          <p className={styles.helpText}>如有其他需要說明的事項，請在此填寫</p>
        </div>

        <button type="submit" className={`${styles.btn} ${styles.btnBlock}`}>送出申請</button>
      </form>
    </div>
  );
}