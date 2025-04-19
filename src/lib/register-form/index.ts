export function handleAlumniRegister(email: any, formDataIn: any) {
    const form = formDataIn as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name");
    const phone = formData.get("phone");
    const studentCardFront = formData.get("studentCardFront");
    const studentCardBack = formData.get("studentCardBack");
    const idDocumentFront = formData.get("idDocumentFront");
    const idDocumentBack = formData.get("idDocumentBack");
    const idDocumentPassport = formData.get("idDocumentPassport");
    const notes = formData.get("notes");
    console.log("Alumni registration data:", {
        email,
        name,
        phone,
        studentCardFront,
        studentCardBack,
        idDocumentFront,
        idDocumentBack,
        idDocumentPassport,
        notes,
    });
}


export function handleCorporateRegister(email: any, formDataIn:any) {
    const form = formDataIn as HTMLFormElement;
    const formData = new FormData(form);

    const company = formData.get("company");
    const companyId = formData.get("companyid");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const notes = formData.get("notes");
    console.log("Corporate registration data:", {
        email,
        company,
        companyId,
        name,
        phone,
        notes,
    });
}