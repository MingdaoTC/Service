"use client";

import { useState, useRef } from "react";

import { updateProfile } from "../actions/updateProfile";
import { UserProfile } from "@/prisma/client";

type FieldOption = {
  value: string;
  label: string;
};

type BaseField = {
  name: keyof UserProfile;
  placeholder?: string;
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

export default function UpdateForm({
  initialData,
}: {
  initialData: UserProfile;
  id: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    const result = await updateProfile(formData);
    if (result.error) {
      setError(result.error);
    } else {
      formRef.current?.reset();
    }
    setIsPending(false);
  }

  // 創建表單字段配置
  const formFields: FormField[] = [
    { name: "website", type: "text", placeholder: "Website" },
    { name: "phone", type: "text", placeholder: "Phone" },
    { name: "description", type: "textarea", placeholder: "Description" },
    { name: "location", type: "text", placeholder: "Location" },
    { name: "talent", type: "text", placeholder: "Talent" },
    { name: "education", type: "text", placeholder: "Education" },
    { name: "experience", type: "text", placeholder: "Experience" },
    {
      name: "gender",
      type: "select",
      options: [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
      ],
    },
    { name: "birthday", type: "date" },
  ];

  const renderField = (field: FormField) => {
    const value = initialData[field.name] ?? "";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={value as string}
          />
        );
      case "select":
        return (
          <select
            key={field.name}
            name={field.name}
            defaultValue={initialData[field.name] as string}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            defaultValue={value as string}
          />
        );
    }
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-red-500">{error}</p>}

      {formFields.map(renderField)}

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-mingdao-blue text-white rounded border-mingdao-blue border hover:bg-transparent hover:text-mingdao-blue transition duration-300 ease-in-out"
      >
        {isPending ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
