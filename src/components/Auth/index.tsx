// AuthWrapperClient.tsx (客戶端組件)
"use client";

// Style
import styles from "@/styles/Register/auth-wrapper.module.css";

// Modules
import { useEffect, useState, ReactNode } from "react";
import { signIn } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

// Components
import Button from "@/components/Global/Button/Button";

// Type
import { User, AccountStatus } from "@/prisma/client";

interface AuthWrapperClientProps {
  isAuthenticated: boolean;
  user: User | null;
  children: ReactNode;
}

export default function AuthWrapperClient({ isAuthenticated, user, children }: AuthWrapperClientProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // 當覆蓋層顯示時，禁止背景滾動
    if (!isAuthenticated) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 清理函數，確保移除限制
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsLoading(true);
    // 使用 server action 來處理登入
    signIn("google")
      .catch(error => {
        console.error("登入失敗:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleGoHome = () => {
    router.push("/");
  };

  // 如果正在載入，返回加載指示器
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ClipLoader color="#00a3ff" size={40} />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.status === AccountStatus.PENDING) {
      return (
        <div className={styles.authWrapper}>
          {children}
          <div className={styles.overlay}>
            <div className={styles.authMessage}>
              <h2>申請驗證</h2>
              <p>您的驗證申請正在審核中<br />我們會在審核完畢後通知您</p>
              <div className={styles.buttonGroup}>
                <Button
                  onClick={handleGoHome}
                  className={styles.loginButton}
                  type="danger"
                >
                  返回首頁
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (user?.status === AccountStatus.VERIFIED) {
      return (
        <div className={styles.authWrapper}>
          {children}
          <div className={styles.overlay}>
            <div className={styles.authMessage}>
              <h2>申請驗證</h2>
              <p>您已經通過驗證申請<br />返回首頁來使用人才雲平台</p>
              <div className={styles.buttonGroup}>
                <Button
                  onClick={handleGoHome}
                  className={styles.loginButton}
                  type="danger"
                >
                  返回首頁
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className={styles.authWrapper}>
      {children}

      {/* 未登入時顯示的覆蓋層 */}
      {!isAuthenticated && (
        <div className={styles.overlay}>
          <div className={styles.authMessage}>
            <h2>請先登入</h2>
            <p>您需要登入才能使用此功能</p>
            <div className={styles.buttonGroup}>
              <Button
                onClick={handleGoHome}
                className={styles.homeButton}
                type="secondary"
              >
                返回首頁
              </Button>
              <Button
                type="primary"
                onClick={handleLogin}
                className={styles.loginButton}
              >
                前往登入
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}