"use client";

import { useState, useRef, Fragment } from "react";

import { updateProfile } from "../actions/updateProfile";
import { createProfile } from "../actions/createProfile";
import OperationInfoDialog from "../UpdateForm/OperationInfoDialog";
import { UserProfile } from "@/prisma/client";

type FieldOption = {
  value: string;
  label: string;
};

type BaseField = {
  name: keyof UserProfile;
  placeholder?: string;
  title: string;
  disabled?: boolean;
};

type InputField = BaseField & {
  type: "text" | "date";
};

type TextareaField = BaseField & {
  type: "textarea";
};

type SelectField = BaseField & {
  type: "select";
  options: FieldOption[];
};

type FormField = InputField | TextareaField | SelectField;

type ProfileFormProps = {
  initialData?: UserProfile;
  mode: "create" | "update";
};

export default function UpdateForm({ initialData, mode }: ProfileFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);

    const result: { error: string | null } =
      mode === "update"
        ? await updateProfile(formData)
        : await createProfile(formData);

    if (result?.error) {
      setError(result?.error);
      setDialogMessage(result?.error);
      setIsDialogOpen(true);
    } else {
      formRef.current?.reset();
    }

    setIsPending(false);

    setDialogMessage(mode === "update" ? "更新成功" : "新增成功");
    setIsDialogOpen(true);
  }

  const formFields: FormField[] = [
    {
      name: "birthday",
      type: "text",
      placeholder: "Birthday",
      title: "生日",
      disabled: mode === "update",
    },
    {
      name: "identityNumber",
      type: "text",
      placeholder: "Identity Number",
      title: "身分證號碼",
      disabled: mode === "update",
    },
    {
      name: "website",
      type: "text",
      placeholder: "Website",
      title: "個人網站",
    },
    { name: "phone", type: "text", placeholder: "Phone", title: "聯絡電話" },
    {
      name: "description",
      type: "textarea",
      placeholder: "Description",
      title: "自我介紹",
    },
    {
      name: "location",
      type: "text",
      placeholder: "Location",
      title: "居住地",
    },
    { name: "talent", type: "text", placeholder: "Talent", title: "專長" },
    {
      name: "education",
      type: "text",
      placeholder: "Education",
      title: "學歷",
    },
    {
      name: "experience",
      type: "text",
      placeholder: "Experience",
      title: "工作經歷",
    },
    {
      name: "gender",
      type: "select",
      title: "性別",
      options: [
        { value: "UNSPECIFIED", label: "Other" },
        { value: "MALE", label: "Male" },
        { value: "FEMALE", label: "Female" },
      ],
    },
  ];

  const renderField = (field: FormField) => {
    const value = initialData?.[field.name] ?? "";

    switch (field.type) {
      case "textarea":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>{field.title}</label>
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={value as string}
              className="border border-gray-300 rounded px-4 py-2"
              disabled={field.disabled}
            />
          </Fragment>
        );
      case "select":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>{field.title}</label>
            <select
              key={field.name}
              name={field.name}
              defaultValue={field.options[0].value}
              className="border border-gray-300 rounded px-4 py-2"
              disabled={field.disabled}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Fragment>
        );
      default:
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>{field.title}</label>
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={value as string}
              className="border border-gray-300 rounded px-4 py-2"
              disabled={field.disabled}
            />
          </Fragment>
        );
    }
  };

  return (
    <>
      <OperationInfoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        message={dialogMessage}
      />
      <form
        ref={formRef}
        action={handleSubmit}
        className="flex flex-col gap-4 w-[90dvw] max-w-[1440px] mx-auto py-6"
      >
        {mode === "create" ? (
          <h1 className="text-2xl text-gray-900">
            你還沒有創建個人檔案，馬上來創建吧！
          </h1>
        ) : (
          <h1 className="text-3xl">更新個人檔案</h1>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {formFields.map(renderField)}

        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-mingdao-blue text-white rounded border-mingdao-blue border hover:bg-transparent hover:text-mingdao-blue transition duration-300 ease-in-out"
        >
          {isPending
            ? mode === "update"
              ? "Updating..."
              : "Creating..."
            : mode === "update"
            ? "Update"
            : "Create"}
        </button>
      </form>
    </>
  );
}
