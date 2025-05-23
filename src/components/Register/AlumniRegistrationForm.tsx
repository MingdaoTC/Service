// components/Register/AlumniRegistrationForm.tsx
"use client";

import styles from "@/styles/Register/index.module.css";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";

// Import the server action
import { handleAlumniRegister } from "@/app/(main)/register/_register/action/submitForm";

type IdDocumentType = "idCard" | "passport";
type UploadedFile = {
  file: File;
  type: string;
  side?: "front" | "back";
};

export default function AlumniRegistrationForm({
  setIsOpenDialog,
  setTitle,
  setMessage,
  setbackHome,
  isDisabled = false,
  disabledReason = "",
}: {
  setIsOpenDialog: (value: boolean) => void;
  setTitle: (value: string) => void;
  setMessage: (value: string) => void;
  setbackHome: (value: boolean) => void;
  isDisabled?: boolean;
  disabledReason?: string;
}): JSX.Element {
  const { data: session } = useSession();
  const userMail = session?.user?.email || "";

  const [stuCardYes, _setStuCardYes] = useState(true);
  const [idDocumentType, setIdDocumentType] =
    useState<IdDocumentType>("idCard");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const _fileInputStudentCardFrontRef = useRef<HTMLInputElement>(null);
  const _fileInputStudentCardBackRef = useRef<HTMLInputElement>(null);
  const _fileInputFrontRef = useRef<HTMLInputElement>(null);
  const _fileInputBackRef = useRef<HTMLInputElement>(null);
  const _fileInputPassportRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const _handleDocumentTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (isDisabled) {
      return;
    }

    setIdDocumentType(e.target.value as IdDocumentType);
    // 清空已上傳的其他證件文件，保留學生證
    setUploadedFiles((prev) =>
      prev.filter((file) => file.type === "studentCard"),
    );
  };

  const _handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: string,
    side?: "front" | "back",
  ) => {
    if (isDisabled) {
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = type;

      // 檢查是否已存在相同類型和面向的文件
      const newFiles = [...uploadedFiles];
      const existingIndex = newFiles.findIndex(
        (f) => f.type === fileType && f.side === side,
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

  const _removeFile = (type: string, side?: "front" | "back") => {
    if (isDisabled) {
      return;
    }

    setUploadedFiles((prev) =>
      prev.filter((file) => !(file.type === type && file.side === side)),
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isDisabled) {
      // Show dialog with the reason why form is disabled
      setTitle("無法提交申請");
      setMessage(disabledReason);
      setIsOpenDialog(true);
      setbackHome(false);
      return;
    }

    // Original validation and submission logic...
    let isValid = true;
    let errorMessage = "";

    // 檢查學生證正反面是否已上傳
    const hasStudentCardFront = uploadedFiles.some(
      (f) => f.type === "studentCard" && f.side === "front",
    );
    const hasStudentCardBack = uploadedFiles.some(
      (f) => f.type === "studentCard" && f.side === "back",
    );

    if (stuCardYes) {
      if (!hasStudentCardFront || !hasStudentCardBack) {
        isValid = false;
        errorMessage = "請上傳學生證正反面";
      }
    }

    // 檢查身分證或護照是否已上傳
    if (idDocumentType === "idCard") {
      const hasIdCardFront = uploadedFiles.some(
        (f) => f.type === "idCard" && f.side === "front",
      );
      const hasIdCardBack = uploadedFiles.some(
        (f) => f.type === "idCard" && f.side === "back",
      );

      if (!hasIdCardFront || !hasIdCardBack) {
        isValid = false;
        errorMessage = errorMessage
          ? `${errorMessage} 以及身分證正反面`
          : "請上傳身分證正反面";
      }
    } else if (idDocumentType === "passport") {
      const hasPassport = uploadedFiles.some((f) => f.type === "passport");

      if (!hasPassport) {
        isValid = false;
        errorMessage = errorMessage ? `${errorMessage} 以及護照` : "請上傳護照";
      }
    }

    if (!isValid) {
      alert(errorMessage);
      return;
    }

    // 設置為正在提交
    setIsSubmitting(true);

    try {
      // Create FormData from the form
      const formData = new FormData(e.currentTarget);

      // Add email explicitly
      formData.append("email", userMail);

      // Call the server action
      const result = await handleAlumniRegister(formData);

      // Process the result based on status
      if (result.success && result.data?.status === 201) {
        setTitle("審核資料已成功送出");
        setMessage(
          "<p>我們已收到您的申請資料</p><p>審核完畢後我們將會聯絡您</p>",
        );
        setIsOpenDialog(true);
      } else if (result.success && result.data?.status === 409) {
        setTitle("審核資料重複送出");
        setMessage(
          "<p>我們已收到您的申請資料</p><p>審核完畢後我們將會聯絡您</p>",
        );
        setIsOpenDialog(true);
      } else {
        setTitle("審核資料送出失敗");
        setMessage("出現非預期的錯誤，請稍後重試");
        setIsOpenDialog(true);
        setbackHome(false);
        // 如果失敗，重設提交狀態以便用戶重試
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setTitle("審核資料送出失敗");
      setMessage("出現非預期的錯誤，請稍後重試");
      setIsOpenDialog(true);
      setbackHome(false);
      // 如果失敗，重設提交狀態以便用戶重試
      setIsSubmitting(false);
    }
  };

  // Wrap form in fieldset to easily disable all elements
  return (
    <form
      id="alumni-registration-form"
      className={styles.form}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <fieldset
        disabled={isDisabled}
        className={isDisabled ? "opacity-60" : ""}
      >
        <input
          type="hidden"
          id="account-type"
          name="accountType"
          value="alumni"
        />

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.required}>
            電子郵件
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            disabled
            value={userMail}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.required}>
            姓名
          </label>
          <input type="text" id="name" name="name" required />
          <p className={styles.helpText}>請填寫您的真實姓名</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.required}>
            手機號碼
          </label>
          <input type="tel" id="phone" name="phone" required />
          <p className={styles.helpText}>請填寫能夠聯絡道您的手機號碼</p>
        </div>

        {/* 必填項目：學生證 */}
        {/* <div className={styles.formGroup}>
          <label htmlFor="student-card" className={styles.required}>
            學生證
          </label>
          <input
            type="checkbox"
            id="student-card"
            name="studentCard"
            className="mr-1 mb-2"
            onChange={(e: any) => {
              if (isDisabled) {
                return;
              }
              setStuCardYes(!e.target.checked);
              if (e.target.checked) {
                if (fileInputStudentCardFrontRef.current) {
                  fileInputStudentCardFrontRef.current.value = "";
                }
                if (fileInputStudentCardBackRef.current) {
                  fileInputStudentCardBackRef.current.value = "";
                }
              }
            }}
          />
          我沒有學生證
          <div
            className={
              styles.documentUploadContainer + (stuCardYes ? " " : " !hidden")
            }
          >
            <div className={styles.documentUploadSide}>
              <p className={styles.uploadLabel}>學生證正面</p>
              <div
                className={
                  styles.fileUpload + (stuCardYes ? " " : " cursor-not-allowed")
                }
              >
                <label
                  htmlFor="student-card-front"
                  className={
                    styles.fileUploadLabel +
                    (stuCardYes
                      ? " "
                      : " hover:!border-[#ddd] hover:cursor-not-allowed select-none")
                  }
                >
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
                  disabled={!stuCardYes}
                />
              </div>

              {uploadedFiles.some(
                (f) => f.type === "studentCard" && f.side === "front",
              ) && (
                <div className={styles.uploadedFile}>
                  <span>
                    {
                      uploadedFiles.find(
                        (f) => f.type === "studentCard" && f.side === "front",
                      )?.file.name
                    }
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
              <div
                className={
                  styles.fileUpload + (stuCardYes ? " " : " cursor-not-allowed")
                }
              >
                <label
                  htmlFor="student-card-back"
                  className={
                    styles.fileUploadLabel +
                    (stuCardYes
                      ? " "
                      : " hover:!border-[#ddd] hover:cursor-not-allowed select-none")
                  }
                >
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
                  disabled={!stuCardYes}
                />
              </div>

              {uploadedFiles.some(
                (f) => f.type === "studentCard" && f.side === "back",
              ) && (
                <div className={styles.uploadedFile}>
                  <span>
                    {
                      uploadedFiles.find(
                        (f) => f.type === "studentCard" && f.side === "back",
                      )?.file.name
                    }
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
        </div> */}

        {/* 其他身份證明文件選項 */}
        {/* <div className={styles.formGroup}>
          <label htmlFor="id-document-type" className={styles.required}>
            其他身份驗證文件
          </label>
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
                  <label
                    htmlFor="id-document-front"
                    className={styles.fileUploadLabel}
                  >
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

                {uploadedFiles.some(
                  (f) => f.type === "idCard" && f.side === "front",
                ) && (
                  <div className={styles.uploadedFile}>
                    <span>
                      {
                        uploadedFiles.find(
                          (f) => f.type === "idCard" && f.side === "front",
                        )?.file.name
                      }
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
                  <label
                    htmlFor="id-document-back"
                    className={styles.fileUploadLabel}
                  >
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

                {uploadedFiles.some(
                  (f) => f.type === "idCard" && f.side === "back",
                ) && (
                  <div className={styles.uploadedFile}>
                    <span>
                      {
                        uploadedFiles.find(
                          (f) => f.type === "idCard" && f.side === "back",
                        )?.file.name
                      }
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
                <label
                  htmlFor="id-document-passport"
                  className={styles.fileUploadLabel}
                >
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

              {uploadedFiles.some((f) => f.type === "passport") && (
                <div className={styles.uploadedFile}>
                  <span>
                    {
                      uploadedFiles.find((f) => f.type === "passport")?.file
                        .name
                    }
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
        </div> */}

        <div className={styles.formGroup}>
          <label htmlFor="notes">備註</label>
          <textarea id="notes" name="notes" rows={4} />
          <p className={styles.helpText}>如有其他需要說明的事項，請在此填寫</p>
        </div>

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnBlock} disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:opacity-50 disabled:hover:bg-mingdao-blue`}
          disabled={isSubmitting || isDisabled}
        >
          {isSubmitting ? "處理中..." : "送出申請"}
        </button>
      </fieldset>
    </form>
  );
}
