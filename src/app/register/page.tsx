"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import styles from "@/styles/Register/index.module.css";

type AccountType = "alumni" | "corporate";
type IdDocumentType = "idCard" | "passport";
type UploadedFile = {
  file: File;
  type: string;
  side?: "front" | "back";
};
import type { User } from "@/prisma/client";

export default function RegistrationPage() {
  const [accountType, setAccountType] = useState<AccountType>("alumni");
  const [idDocumentType, setIdDocumentType] = useState<IdDocumentType>("idCard");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputStudentCardFrontRef = useRef<HTMLInputElement>(null);
  const fileInputStudentCardBackRef = useRef<HTMLInputElement>(null);
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);
  const fileInputPassportRef = useRef<HTMLInputElement>(null);

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    // 清空已上傳的文件
    setUploadedFiles([]);
  };

  const handleDocumentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIdDocumentType(e.target.value as IdDocumentType);
    // 清空已上傳的其他證件文件，保留學生證
    setUploadedFiles(prev => prev.filter(file => file.type === "studentCard"));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: string, side?: "front" | "back") => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = type;

      // 檢查是否已存在相同類型和面向的文件
      const newFiles = [...uploadedFiles];
      const existingIndex = newFiles.findIndex(
        f => f.type === fileType && f.side === side
      );

      if (existingIndex !== -1) {
        // 替換現有文件
        newFiles[existingIndex] = { file, type: fileType, side };
      } else {
        // 添加新文件
        newFiles.push({ file, type: fileType, side });
      }

      setUploadedFiles(newFiles);
    }
  };

  const removeFile = (type: string, side?: "front" | "back") => {
    setUploadedFiles(prev =>
      prev.filter(file => !(file.type === type && file.side === side))
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 驗證文件是否已上傳
    let isValid = true;
    let errorMessage = "";

    if (accountType === "alumni") {
      // 檢查學生證正反面是否已上傳
      const hasStudentCardFront = uploadedFiles.some(f => f.type === "studentCard" && f.side === "front");
      const hasStudentCardBack = uploadedFiles.some(f => f.type === "studentCard" && f.side === "back");

      if (!hasStudentCardFront || !hasStudentCardBack) {
        isValid = false;
        errorMessage = "請上傳學生證正反面";
      }

      // 檢查身分證或護照是否已上傳
      if (idDocumentType === "idCard") {
        const hasIdCardFront = uploadedFiles.some(f => f.type === "idCard" && f.side === "front");
        const hasIdCardBack = uploadedFiles.some(f => f.type === "idCard" && f.side === "back");

        if (!hasIdCardFront || !hasIdCardBack) {
          isValid = false;
          errorMessage = errorMessage ? errorMessage + " 以及身分證正反面" : "請上傳身分證正反面";
        }
      } else if (idDocumentType === "passport") {
        const hasPassport = uploadedFiles.some(f => f.type === "passport");

        if (!hasPassport) {
          isValid = false;
          errorMessage = errorMessage ? errorMessage + " 以及護照" : "請上傳護照";
        }
      }
    } else {
      // 企業帳號驗證邏輯...
      if (uploadedFiles.length === 0) {
        isValid = false;
        errorMessage = "請上傳身份驗證文件";
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

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
          <label htmlFor="email" className={styles.required}>電子郵件</label>
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

        {accountType === "alumni" ? (
          <>
            {/* 必填項目：學生證 */}
            <div className={styles.formGroup}>
              <label htmlFor="student-card" className={styles.required}>學生證</label>
              <div className={styles.documentUploadContainer}>
                <div className={styles.documentUploadSide}>
                  <p className={styles.uploadLabel}>學生證正面</p>
                  <div className={styles.fileUpload}>
                    <label htmlFor="student-card-front" className={styles.fileUploadLabel}>
                      <span className={styles.fileUploadIcon}>📎</span>
                      <span>點擊上傳</span>
                    </label>
                    <input
                      type="file"
                      id="student-card-front"
                      name="studentCardFront"
                      accept="image/*,.pdf"
                      ref={fileInputStudentCardFrontRef}
                      onChange={(e) => handleFileChange(e, "studentCard", "front")}
                      required
                    />
                  </div>

                  {uploadedFiles.some(f => f.type === "studentCard" && f.side === "front") && (
                    <div className={styles.uploadedFile}>
                      <span>
                        {uploadedFiles.find(f => f.type === "studentCard" && f.side === "front")?.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("studentCard", "front")}
                        className={styles.removeButton}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.documentUploadSide}>
                  <p className={styles.uploadLabel}>學生證反面</p>
                  <div className={styles.fileUpload}>
                    <label htmlFor="student-card-back" className={styles.fileUploadLabel}>
                      <span className={styles.fileUploadIcon}>📎</span>
                      <span>點擊上傳</span>
                    </label>
                    <input
                      type="file"
                      id="student-card-back"
                      name="studentCardBack"
                      accept="image/*,.pdf"
                      ref={fileInputStudentCardBackRef}
                      onChange={(e) => handleFileChange(e, "studentCard", "back")}
                      required
                    />
                  </div>

                  {uploadedFiles.some(f => f.type === "studentCard" && f.side === "back") && (
                    <div className={styles.uploadedFile}>
                      <span>
                        {uploadedFiles.find(f => f.type === "studentCard" && f.side === "back")?.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("studentCard", "back")}
                        className={styles.removeButton}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 其他身份證明文件選項 */}
            <div className={styles.formGroup}>
              <label htmlFor="id-document-type" className={styles.required}>其他身份驗證文件</label>
              <select
                id="id-document-type"
                className={styles.select}
                value={idDocumentType}
                onChange={handleDocumentTypeChange}
                required
              >
                <option value="idCard">身分證</option>
                <option value="passport">護照</option>
              </select>

              {idDocumentType === "idCard" && (
                <div className={styles.documentUploadContainer}>
                  <div className={styles.documentUploadSide}>
                    <p className={styles.uploadLabel}>身分證正面</p>
                    <div className={styles.fileUpload}>
                      <label htmlFor="id-document-front" className={styles.fileUploadLabel}>
                        <span className={styles.fileUploadIcon}>📎</span>
                        <span>點擊上傳</span>
                      </label>
                      <input
                        type="file"
                        id="id-document-front"
                        name="idDocumentFront"
                        accept="image/*,.pdf"
                        ref={fileInputFrontRef}
                        onChange={(e) => handleFileChange(e, "idCard", "front")}
                        required
                      />
                    </div>

                    {uploadedFiles.some(f => f.type === "idCard" && f.side === "front") && (
                      <div className={styles.uploadedFile}>
                        <span>
                          {uploadedFiles.find(f => f.type === "idCard" && f.side === "front")?.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile("idCard", "front")}
                          className={styles.removeButton}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={styles.documentUploadSide}>
                    <p className={styles.uploadLabel}>身分證反面</p>
                    <div className={styles.fileUpload}>
                      <label htmlFor="id-document-back" className={styles.fileUploadLabel}>
                        <span className={styles.fileUploadIcon}>📎</span>
                        <span>點擊上傳</span>
                      </label>
                      <input
                        type="file"
                        id="id-document-back"
                        name="idDocumentBack"
                        accept="image/*,.pdf"
                        ref={fileInputBackRef}
                        onChange={(e) => handleFileChange(e, "idCard", "back")}
                        required
                      />
                    </div>

                    {uploadedFiles.some(f => f.type === "idCard" && f.side === "back") && (
                      <div className={styles.uploadedFile}>
                        <span>
                          {uploadedFiles.find(f => f.type === "idCard" && f.side === "back")?.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile("idCard", "back")}
                          className={styles.removeButton}
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {idDocumentType === "passport" && (
                <div>
                  <p className={styles.uploadLabel}>護照照片</p>
                  <div className={styles.fileUpload}>
                    <label htmlFor="id-document-passport" className={styles.fileUploadLabel}>
                      <span className={styles.fileUploadIcon}>📎</span>
                      <span>點擊上傳</span>
                    </label>
                    <input
                      type="file"
                      id="id-document-passport"
                      name="idDocumentPassport"
                      accept="image/*,.pdf"
                      ref={fileInputPassportRef}
                      onChange={(e) => handleFileChange(e, "passport")}
                      required
                    />
                  </div>

                  {uploadedFiles.some(f => f.type === "passport") && (
                    <div className={styles.uploadedFile}>
                      <span>
                        {uploadedFiles.find(f => f.type === "passport")?.file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile("passport")}
                        className={styles.removeButton}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.formGroup}>
            <label htmlFor="id-document" className={styles.required}>身份驗證文件上傳</label>
            <p className={styles.uploadLabel}>證件照片（身分證、護照正反面）</p>
            <div className={styles.fileUpload}>
              <label htmlFor="id-document" className={styles.fileUploadLabel}>
                <span className={styles.fileUploadIcon}>📎</span>
                <span>點擊上傳</span>
              </label>
              <input
                type="file"
                id="id-document"
                name="idDocument"
                accept="image/*,.pdf"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files).map(file => ({
                      file,
                      type: "corporate"
                    }));
                    setUploadedFiles(files);
                  }
                }}
              />
            </div>

            <div className={styles.uploadedFiles}>
              {uploadedFiles.filter(f => f.type === "corporate").map((file, index) => (
                <div key={index} className={styles.uploadedFile}>
                  <span>{file.file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFiles(prev => prev.filter((_, i) =>
                        !(prev[i].type === "corporate" && prev[i].file.name === file.file.name)
                      ));
                    }}
                    className={styles.removeButton}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <p className={styles.helpText}>請上傳清晰可辨識的證件照片，支援 JPG、PNG、PDF 格式</p>
          </div>
        )}

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