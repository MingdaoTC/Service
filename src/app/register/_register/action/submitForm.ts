"use server";

import { auth } from "@/library/auth";
import { upload } from "@/library/r2/upload";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { cookies } from "next/headers";

/**
 * 獲取當前的主機URL，用於構建API請求地址
 */
function getBaseUrl() {
  // 獲取請求頭
  const headersList = headers();
  // 獲取主機名
  const host = headersList.get("host") || "localhost:3000";
  // 確定協議（如果有X-Forwarded-Proto使用它，否則預設為https）
  const protocol = headersList.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}`;
}

/**
 * Server action to handle alumni registration form submissions
 */
export async function handleAlumniRegister(formData: FormData) {
  try {
    // 確保有有效的用戶會話
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "未登入或會話已過期",
        data: { status: 403 },
      };
    }

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const email = formData.get("email") as string;

    // Get files from the form data
    const studentCardFrontFile = formData.get("studentCardFront") as File;
    const studentCardBackFile = formData.get("studentCardBack") as File;
    const idDocumentFrontFile = formData.get("idDocumentFront") as File;
    const idDocumentBackFile = formData.get("idDocumentBack") as File;
    const idDocumentPassportFile = formData.get("idDocumentPassport") as File;

    const files = [
      { type: "studentCardFront", file: studentCardFrontFile },
      { type: "studentCardBack", file: studentCardBackFile },
      { type: "idDocumentFront", file: idDocumentFrontFile },
      { type: "idDocumentBack", file: idDocumentBackFile },
      { type: "idDocumentPassport", file: idDocumentPassportFile },
    ];

    const isValidFile = (file: any): boolean => {
      return file instanceof File && file.size > 0 && file.name !== "";
    };

    const date = Date.now();
    let fileData: { [key: string]: string } = {};
    const fileResults = [];

    // Upload each valid file
    for (const file of files) {
      if (isValidFile(file.file)) {
        try {
          const extension = file.file.name.split(".").pop() || "";
          const filename = `register/${email}/${file.type}_${date}.${extension}`;
          const result = await upload(file.file, filename, file.file.type);
          fileResults.push({ type: file.type, result, filename });
        } catch (error) {
          console.error(`Error uploading file ${file.type}:`, error);
          fileResults.push({ type: file.type, result: null });
        }
      } else {
        fileResults.push({ type: file.type, result: "false" });
      }
    }

    // Process file upload results
    fileData = fileResults.reduce((acc: any, item: any) => {
      acc[item.type] = item.filename || "false";
      return acc;
    }, {});

    // Prepare data for API
    const data = {
      email,
      name,
      phone,
      studentCardFront: fileData.studentCardFront || "false",
      studentCardBack: fileData.studentCardBack || "false",
      idDocumentFront: fileData.idDocumentFront || "false",
      idDocumentBack: fileData.idDocumentBack || "false",
      idDocumentPassport: fileData.idDocumentPassport || "false",
      notes,
    };

    // 獲取完整的API URL
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/registration/alumni`;

    // 獲取所有 cookies 以保留身份驗證信息
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Send data to API with cookies for authentication
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // 傳遞 cookies 以保持身份驗證
      },
      body: JSON.stringify(data),
      credentials: "include", // 包含憑證
    });

    // Process response
    const result = await response.json();

    // Revalidate path
    revalidatePath("/register");

    return {
      success: true,
      data: { ...result, status: response.status },
    };
  } catch (error) {
    console.error("Error in alumni registration:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Server action to handle corporate registration form submissions
 */
export async function handleCorporateRegister(formData: FormData) {
  try {
    // 確保有有效的用戶會話
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "未登入或會話已過期",
        data: { status: 403 },
      };
    }

    const companyName = formData.get("company") as string;
    const companyId = formData.get("companyid") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;
    const email = formData.get("email") as string;

    // Prepare data for API
    const data = {
      email,
      companyName,
      companyId,
      name,
      phone,
      notes,
    };

    // 獲取完整的API URL
    const baseUrl = getBaseUrl();
    const apiUrl = `${baseUrl}/api/registration/company`;

    // 獲取所有 cookies 以保留身份驗證信息
    const cookieStore = cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    // Send data to API with cookies for authentication
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // 傳遞 cookies 以保持身份驗證
      },
      body: JSON.stringify(data),
      credentials: "include", // 包含憑證
    });

    // Process response
    const result = await response.json();

    // Revalidate path
    revalidatePath("/register");

    return {
      success: true,
      data: { ...result, status: response.status },
    };
  } catch (error) {
    console.error("Error in corporate registration:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
