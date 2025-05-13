"use server";

import { revalidatePath } from "next/cache";
import { upload } from "@/library/r2/upload";

/**
 * Server action to handle alumni registration form submissions
 */
export async function handleAlumniRegister(formData: FormData) {
  try {
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
          const filename = `${email}_${file.type}_${date}.${extension}`;
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

    // Send data to API
    const response = await fetch("/api/registration/alumni", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Process response
    const result = await response.json();
    
    // Revalidate path
    revalidatePath("/register");
    
    return { 
      success: true, 
      data: { ...result, status: response.status } 
    };
  } catch (error) {
    console.error("Error in alumni registration:", error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}

/**
 * Server action to handle corporate registration form submissions
 */
export async function handleCorporateRegister(formData: FormData) {
  try {
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

    // Send data to API
    const response = await fetch("/api/registration/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Process response
    const result = await response.json();
    
    // Revalidate path
    revalidatePath("/register");
    
    return { 
      success: true, 
      data: { ...result, status: response.status } 
    };
  } catch (error) {
    console.error("Error in corporate registration:", error);
    return { 
      success: false, 
      error: (error as Error).message 
    };
  }
}