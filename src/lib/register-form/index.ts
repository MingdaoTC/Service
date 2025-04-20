import { upload } from "@/lib/r2/upload";
import type { AlumniRegistration, CorporateRegistration } from "@/prisma/client";

// libs
import { findAlumniRegistration } from "@/lib/db/registration/alumni/find";
import { findCorporateRegistration } from "@/lib/db/registration/corporate/find";
import { createAlumniRegistration } from "@/lib/db/registration/alumni/create";
import { createCoporateRegistration } from "@/lib/db/registration/corporate/create";

export async function handleAlumniRegister(email: any, formDataIn: any) {
  const form = formDataIn as HTMLFormElement;
  const formData = new FormData(form);
  const name = formData.get("name");
  const phone = formData.get("phone");
  const notes = formData.get("notes");

  const data = {
    email,
    name,
    phone,
    notes,
  };

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

  let fileData = {};

  const fileResults = [];

  for (const file of files) {
    if (isValidFile(file.file)) {
      try {
        const extension = file.file.name.split(".").pop() || "";
        const filename = `${email}_${file.type}_${date}.${extension}`;
        // const result = await upload(file.file, filename, file.file.type);
        const result = null;
        fileResults.push({ type: file.type, result, filename });
      } catch (error) {
        console.error(`Error uploading file ${file.type}:`, error);
        fileResults.push({ type: file.type, result: null });
      }
    } else {
      fileResults.push({ type: file.type, result: "false" });
    }
  }

  fileData = fileResults.reduce((acc: any, item: any) => {
    acc[item.type] = item.filename || "false";
    return acc;
  }, {});

  console.log("Files data:", fileData);
  console.log("Alumni registration data:", data);

  return { data, fileData };
}

export async function handleCorporateRegister(email: any, formDataIn: any) {
  const form = formDataIn as HTMLFormElement;
  const formData = new FormData(form);
  const companyName = formData.get("company") as string;
  const companyId = formData.get("companyid") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const notes = formData.get("notes") as string;

  let corporateRegistration = await findCorporateRegistration({ email: email });

  if (corporateRegistration) {
    return { exist: true, corporateRegistration};
  } else {
    corporateRegistration = await createCoporateRegistration({
      email,
      companyName,
      companyId,
      name,
      phone,
      notes,
    });
   
  }
  return { exist: false, corporateRegistration};
}
