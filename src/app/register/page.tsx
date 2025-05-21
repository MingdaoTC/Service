// app/register/page.tsx
"use client";

import AlumniRegistrationForm from "@/components/Register/AlumniRegistrationForm";
import CorporateRegistrationForm from "@/components/Register/CorporateRegistrationForm";
import RegistrationDialog from "@/components/Register/RegistrationDialog";
import { RegistrationStatus } from "@/prisma/client";
import styles from "@/styles/Register/index.module.css";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { checkRegistrationStatus } from "./_register/action/checkRegistrationStatus";

type AccountType = "alumni" | "corporate";

export default function RegistrationPage() {
  const { data: session, status } = useSession();
  const [accountType, setAccountType] = useState<AccountType>("alumni");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [backHome, setbackHome] = useState(true);

  // Add states for form disabling
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [formDisabledReason, setFormDisabledReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleAccountTypeChange = (type: AccountType) => {
    if (!isFormDisabled) {
      setAccountType(type);
    }
  };

  // Check registration status when component loads
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const checkStatus = async () => {
        try {
          const result: any = await checkRegistrationStatus();

          // 修改：直接檢查 data.isRegistered，不依賴 success 字段
          if (result.data?.isRegistered) {
            setIsFormDisabled(true);

            const registrationStatus = result.data.status as RegistrationStatus;

            // Create message based on status
            const statusText =
              registrationStatus === RegistrationStatus.APPROVED
                ? "已核准"
                : "審核中";
            const typeText =
              result.data.type === "alumni" ? "校友帳號" : "企業帳號";

            setFormDisabledReason(
              `您已有一個${statusText}的${typeText}註冊。如需更改，請聯絡管理員。`,
            );

            // Set the account type to match the existing registration
            setAccountType(result.data.type as AccountType);
          }
        } catch (error) {
          console.error("Error checking registration status:", error);
        } finally {
          setIsLoading(false);
        }
      };

      checkStatus();
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status, session]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mingdao-blue" />
        </div>
      </div>
    );
  }

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

      {/* Show warning banner when form is disabled */}
      {isFormDisabled && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{formDisabledReason}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${accountType === "alumni" ? styles.active : ""} ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => handleAccountTypeChange("alumni")}
          disabled={isFormDisabled}
        >
          校友帳號
        </button>
        <button
          className={`${styles.tabButton} ${accountType === "corporate" ? styles.active : ""} ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => handleAccountTypeChange("corporate")}
          disabled={isFormDisabled}
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
          isDisabled={isFormDisabled}
          disabledReason={formDisabledReason}
        />
      ) : (
        <CorporateRegistrationForm
          setIsOpenDialog={setIsOpenDialog}
          setTitle={setTitle}
          setMessage={setMessage}
          setbackHome={setbackHome}
          isDisabled={isFormDisabled}
          disabledReason={formDisabledReason}
        />
      )}
    </div>
  );
}
