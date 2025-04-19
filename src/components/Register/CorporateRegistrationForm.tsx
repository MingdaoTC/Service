"use client";

import { FormEvent } from "react";
import styles from "@/styles/Register/index.module.css";
import { useSession } from "next-auth/react";

type UploadedFile = {
    file: File;
    type: string;
};

export default function CorporateRegistrationForm() {
    const { data: session } = useSession();
    const userMail = session?.user?.email || "";

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 驗證文件是否已上傳
        let isValid = true;
        let errorMessage = "";

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // 處理表單提交邏輯
        alert("表單已提交！在實際應用中，這裡會處理表單資料並傳送到伺服器。");
    };

    return (
        <form id="corporate-registration-form" className={styles.form} onSubmit={handleSubmit}>
            <input type="hidden" id="account-type" name="accountType" value="corporate" />

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.required}>電子郵件</label>
                <input type="email" id="email" name="email" required disabled value={userMail} />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.required}>公司統編</label>
                <input type="text" id="company" name="company" required />
                <p className={styles.helpText}>請輸入公司統一編號</p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.required}>公司名稱</label>
                <input type="text" id="company" name="company" required />
                <p className={styles.helpText}>請輸入營業登記名稱</p>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.required}>連絡人姓名</label>
                <input type="text" id="name" name="name" required />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.required}>聯絡人電話</label>
                <input type="tel" id="phone" name="phone" required />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="notes">備註</label>
                <textarea id="notes" name="notes" rows={4}></textarea>
                <p className={styles.helpText}>如有其他需要說明的事項，請在此填寫</p>
            </div>

            <button type="submit" className={`${styles.btn} ${styles.btnBlock}`}>送出申請</button>
        </form>
    );
}