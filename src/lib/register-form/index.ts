import { upload } from "@/lib/r2/upload";

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

  // 检查文件是否为有效的 File 对象且有内容
  const isValidFile = (file: any): boolean => {
    return file instanceof File && file.size > 0 && file.name !== "";
  };

  let fileData = {};

  // 处理有效的文件
  const fileResults = [];

  for (const file of files) {
    // 只有当文件是有效的 File 对象时才尝试上传
    if (isValidFile(file.file)) {
      try {
        // 创建文件名
        const extension = file.file.name.split(".").pop() || "";
        const filename = `${email}_${file.type}_${Date.now()}.${extension}`;

        // 上传文件
        const result = await upload(file.file, filename, file.file.type);
        console.log(`File ${file.type} upload result:`, result);
        fileResults.push({ type: file.type, result });
      } catch (error) {
        console.error(`Error uploading file ${file.type}:`, error);
        fileResults.push({ type: file.type, result: null });
      }
    } else {
      // 如果没有有效文件，就将该类型文件的结果设为 "false"
      fileResults.push({ type: file.type, result: "false" });
    }
  }

  // 转换结果为所需的 fileData 格式
  fileData = fileResults.reduce((acc: any, item: any) => {
    acc[item.type] = item.result || "false";
    return acc;
  }, {});

  console.log("Files data:", fileData);
  console.log("Alumni registration data:", data);

  return { data, fileData };
}

export async function handleCorporateRegister(email: any, formDataIn: any) {
  const form = formDataIn as HTMLFormElement;
  const formData = new FormData(form);
  const company = formData.get("company");
  const companyId = formData.get("companyid");
  const name = formData.get("name");
  const phone = formData.get("phone");
  const notes = formData.get("notes");

  const registrationData = {
    email,
    company,
    companyId,
    name,
    phone,
    notes,
  };

  console.log("Corporate registration data:", registrationData);
  return registrationData;
}
