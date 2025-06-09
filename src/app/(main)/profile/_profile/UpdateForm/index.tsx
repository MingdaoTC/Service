"use client";

import { Fragment, useRef, useState } from "react";

import OperationInfoDialog from "@/components/Global/OperationInfoDialog";
import { Gender, UserProfile } from "@/prisma/client";
import { createProfile } from "../actions/createProfile";
import { updateProfile } from "../actions/updateProfile";

import { validateTaiwanId } from "@/library/validators/taiwanId";

type FieldOption = {
  value: string;
  label: string;
};

type BaseField = {
  name: keyof UserProfile;
  placeholder?: string;
  title: string;
  disabled?: boolean;
  pattern?: RegExp;
  required?: boolean;
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

    // check birthday
    if (
      formData.get("birthday") &&
      new Date(formData.get("birthday")?.toString() as string).toString() ===
        "Invalid Date"
    ) {
      setError("生日格式不正確");
      setDialogMessage("生日格式不正確");
      setIsDialogOpen(true);
      setIsPending(false);
      return;
    }

    // check identity Number
    if (
      formData.get("identityNumber") &&
      validateTaiwanId(formData.get("identityNumber")?.toString() as string)
        .error
    ) {
      setError("身分證號碼格式不正確");
      setDialogMessage("身分證號碼格式不正確");
      setIsDialogOpen(true);
      setIsPending(false);
      return;
    }

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
      type: "date",
      title: "生日",
      disabled: mode === "update",
      required: true,
    },
    {
      name: "identityNumber",
      type: "text",
      placeholder: "A123456789",
      title: "身分證號碼",
      disabled: mode === "update",
      pattern: /^[A-Z][12]\d{8}$/gm,
      required: true,
    },
    {
      name: "website",
      type: "text",
      placeholder: "https://example.com",
      title: "個人網站",
    },
    {
      name: "phone",
      type: "text",
      placeholder: "0912345678",
      title: "聯絡電話",
    },
    {
      name: "description",
      type: "textarea",
      placeholder:
        "我畢業於台灣科技大學資訊工程學系，在校期間就對軟體開發產生濃厚興趣，並積極參與各種相關專案。畢業後，我在一家中型科技公司擔任後端工程師三年，主要負責API開發和數據庫優化，成功將系統響應時間縮短了40%。",
      title: "自我介紹",
    },
    {
      name: "location",
      type: "text",
      placeholder: "臺中市烏日區",
      title: "居住地",
    },
    { name: "talent", type: "text", placeholder: "前端/後端", title: "專長" },
    {
      name: "education",
      type: "text",
      placeholder: "大學畢業",
      title: "學歷",
    },
    {
      name: "experience",
      type: "text",
      placeholder: "3年前端工程師",
      title: "工作經歷",
    },
    {
      name: "gender",
      type: "select",
      title: "性別",
      options: [
        { value: Gender.MALE, label: "男" },
        { value: Gender.FEMALE, label: "女" },
        { value: Gender.UNSPECIFIED, label: "其他" },
      ],
    },
  ];

  const renderField = (field: FormField) => {
    const value = initialData?.[field.name] ?? "";

    switch (field.type) {
      case "date":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>{field.title}</label>
            <input
              key={field.name}
              type="date"
              name={field.name}
              defaultValue="2000-01-01"
              placeholder={field.placeholder}
              className={`border border-gray-300 rounded px-4 py-2 ${
                field.disabled ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              disabled={field.disabled}
              required={field.required}
            />
          </Fragment>
        );
      case "textarea":
        return (
          <Fragment key={field.name}>
            <label htmlFor={field.name}>{field.title}</label>
            <textarea
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              defaultValue={value as string}
              className={`border border-gray-300 rounded px-4 py-2 h-24 ${
                field.disabled ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
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
              className={`border border-gray-300 rounded px-4 py-2 ${
                field.disabled ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
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
              className={`border border-gray-300 rounded px-4 py-2 ${
                field.disabled ? "bg-gray-200 cursor-not-allowed" : ""
              }`}
              disabled={field.disabled}
              pattern={field.pattern?.source}
              required={field.required}
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
        onSubmit={(e) => {
          e.preventDefault(); // 防止默認的表單提交行為
          const formData = new FormData(formRef.current as HTMLFormElement);
          handleSubmit(formData);
        }}
        className="flex flex-col gap-4 w-full"
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
          className={`px-4 py-2 ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-mingdao-blue hover:bg-transparent hover:text-mingdao-blue"
          } text-white rounded border-mingdao-blue border transition duration-300 ease-in-out`}
        >
          {isPending
            ? mode === "update"
              ? "更新中..."
              : "建立中..."
            : mode === "update"
              ? "更新"
              : "建立"}
        </button>
      </form>
    </>
  );
}
