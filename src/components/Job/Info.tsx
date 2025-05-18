"use client";
import { useState } from "react";

import { AiOutlineMail } from "react-icons/ai";

import { joinClass } from "@/library/joinClass";
import Button from "../Global/Button/Button";
import LoginPromptDialog from "../Global/LoginPromptDialog/LoginPromptDialog";
import JobApplicationDialog from "./JobApplicationDialog";
import { Company, Job } from "@/prisma/client";

export default function Info({
  jobData,
  company,
  isLogin,
  className,
}: {
  jobData: Job;
  company: Company;
  isLogin: boolean;
  className?: string;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (_formElements: HTMLFormControlsCollection) => {
    return;
  };

  return (
    <>
      {isLogin ? (
        <JobApplicationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleSubmit}
          jobData={{
            title: jobData.title,
            company: company.name,
          }}
        />
      ) : (
        <LoginPromptDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
      <div
        className={joinClass(
          "w-full bg-white shadow-md border-b py-4 sm:py-6 mb-3 sm:mb-5 px-2",
          className
        )}
      >
        <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-fit">
            <h1 className="text-xl sm:text-2xl md:text-3xl text-mingdao-blue-dark font-bold line-clamp-2 sm:line-clamp-none">
              {jobData.title}
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 pt-2 sm:pt-3">
              <p className="text-mingdao-blue text-sm sm:text-base">
                {company.name}
              </p>

              <a
                href={`/company/${company.id}`}
                className="text-mingdao-blue text-sm sm:text-base"
              >
                本公司其他工作
              </a>
            </div>
          </div>
          <div className="flex h-fit gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto justify-end">
            {/* <Button
              type="secondary"
              className="flex items-center gap-1 sm:gap-2 text-sm md:text-base px-3 py-2 sm:px-4"
            >
              <BiBookmark className="translate-y-[1px]" />
              儲存
            </Button> */}
            <Button
              className="flex items-center gap-1 sm:gap-2 text-sm md:text-base px-3 py-2 sm:px-4 bg-mingdao-blue"
              onClick={() => setIsDialogOpen(true)}
              disabled
            >
              <AiOutlineMail className="translate-y-[0.5px]" />
              應徵
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
