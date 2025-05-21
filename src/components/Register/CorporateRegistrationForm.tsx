// components/Register/CorporateRegistrationForm.tsx
"use client";

import styles from "@/styles/Register/index.module.css";
import { useSession } from "next-auth/react";
import { FormEvent, useRef, useState } from "react";

// Import the server action
import { handleCorporateRegister } from "@/app/register/_register/action/submitForm";

export default function CorporateRegistrationForm({
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
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // 設置為正在提交
    setIsSubmitting(true);

    try {
      // Create FormData from the form
      const formData = new FormData(e.currentTarget);

      // Add email explicitly
      formData.append("email", userMail);

      // Call the server action
      const result = await handleCorporateRegister(formData);

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
      id="corporate-registration-form"
      className={styles.form}
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <fieldset
        disabled={isDisabled}
        className={isDisabled ? "opacity-60" : ""}
      >
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.required}>
            電子郵件
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={userMail}
            disabled
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="companyid" className={styles.required}>
            公司統編
          </label>
          <input type="text" id="companyid" name="companyid" required />
          <p className={styles.helpText}>請輸入公司統一編號</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="company" className={styles.required}>
            公司名稱
          </label>
          <input type="text" id="company" name="company" required />
          <p className={styles.helpText}>請輸入營業登記名稱</p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.required}>
            連絡人姓名
          </label>
          <input type="text" id="name" name="name" required />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.required}>
            聯絡人電話
          </label>
          <input type="tel" id="phone" name="phone" required />
        </div>

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
