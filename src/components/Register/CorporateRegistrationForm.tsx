"use client";

import { FormEvent } from "react";
import styles from "@/styles/Register/index.module.css";
import { useSession } from "next-auth/react";
import { handleCorporateRegister } from "@/lib/register-form";

export default function CorporateRegistrationForm() {
    const { data: session } = useSession();
    const userMail = session?.user?.email || "";

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleCorporateRegister(userMail, e.currentTarget);
    };

    return (
        <form id="corporate-registration-form" className={styles.form} onSubmit={handleSubmit}>

            <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.required}>電子郵件</label>
                <input type="email" id="email" name="email" required value={userMail} disabled />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="companyid" className={styles.required}>公司統編</label>
                <input type="text" id="companyid" name="companyid" required />
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