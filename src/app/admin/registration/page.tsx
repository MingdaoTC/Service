"use client";

// Module
import { useEffect, useState } from "react";

// types
import {
  AlumniRegistration,
  CompanyRegistration,
  RegistrationStatus,
} from "@/prisma/client";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export default function RegistrationApprovalPage() {
  const [companyRegistrations, setCompanyRegistrations] =
    useState<Array<CompanyRegistration>>();
  const [alumniRegistrations, setAlumniRegistrations] =
    useState<Array<AlumniRegistration>>();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 處理查看詳情
  const handleView = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  // // 處理通過申請
  // const handleApprove = (id: string) => {
  //     setRegistrations(registrations.map(reg =>
  //         reg.id === id ? { ...reg, status: "approved" } : reg
  //     ));
  // };

  // // 處理拒絕申請
  // const handleReject = (id: string) => {
  //     setRegistrations(registrations.map(reg =>
  //         reg.id === id ? { ...reg, status: "rejected" } : reg
  //     ));
  // };

  useEffect(() => {
    (async () => {
      const data = (
        await fetch("/api/registration", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => res.json())
      ).data;

      setCompanyRegistrations(data.companyRegistration);
      setAlumniRegistrations(data.alumniRegistration);
    })();
  }, []);

  return (
    <div className="w-[98%] sm:w-[95%] max-w-5xl mx-auto my-6">
      <div className="mb-4 bg-white shadow-sm rounded-lg border p-2 pl-4">
        <h1 className="text-xl sm:text-2xl font-semibold text-mingdao-blue-dark my-auto">
          註冊申請驗證審核 - 企業註冊
        </h1>
      </div>
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-7 text-base font-medium text-gray-600">
            <div className="col-span-3">公司統編</div>
            <div className="col-span-3">公司名稱</div>
            <div className="col-span-1 text-center">操作</div>
          </div>
        </div>

        <div className="divide-y">
          {companyRegistrations?.map(
            (registration: CompanyRegistration, index) => (
              <div key={index}>
                <div className="px-4 py-3">
                  <div className="grid grid-cols-7 items-center text-base">
                    <div className="col-span-3">{registration.companyId}</div>
                    <div className="col-span-3">{registration.companyName}</div>
                    <div className="col-span-1 flex justify-center gap-1">
                      {registration.status === RegistrationStatus.PENDING && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleView(registration.id)}
                            className="px-2 py-1 text-base border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                          >
                            查看
                          </button>
                        </div>
                      )}

                      {registration.status === RegistrationStatus.APPROVED && (
                        <span className="text-green-600 text-xs">已通過</span>
                      )}

                      {registration.status === RegistrationStatus.REJECTED && (
                        <span className="text-red-600 text-xs">已拒絕</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 展開的詳細資訊 */}
                {selectedId === registration.id && (
                  <div className="p-4 bg-gray-50 text-sm border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 mb-1">Email:</p>
                        <p>{registration.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">公司負責人:</p>
                        <p>{registration.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">負責人聯絡電話:</p>
                        <p>{registration.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人備註:</p>
                        <p>{registration.notes}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                      {registration.status === RegistrationStatus.PENDING && (
                        <>
                          <button
                            // onClick={() => handleApprove(registration.id)}
                            className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 shadow-sm"
                          >
                            通過
                          </button>
                          <button
                            // onClick={() => handleReject(registration.id)}
                            className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 shadow-sm"
                          >
                            拒絕
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="mb-4 bg-white shadow-sm rounded-lg border p-2 pl-4 mt-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-mingdao-blue-dark my-auto">
          註冊申請驗證審核 - 校友註冊
        </h1>
      </div>
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden mt-2 mb-6">
        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-7 text-base font-medium text-gray-600">
            <div className="col-span-6">姓名</div>
            <div className="col-span-1 text-center">操作</div>
          </div>
        </div>

        <div className="divide-y">
          {alumniRegistrations?.map(
            (registration: AlumniRegistration, index) => (
              <div key={index} className="">
                <div className="px-4 py-3">
                  <div className="grid grid-cols-7 items-center text-base">
                    <div className="col-span-6">{registration.name}</div>
                    <div className="col-span-1 flex justify-center gap-1">
                      {registration.status === RegistrationStatus.PENDING && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleView(registration.id)}
                            className="px-2 py-1 text-base border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
                          >
                            查看
                          </button>
                        </div>
                      )}

                      {registration.status === RegistrationStatus.APPROVED && (
                        <span className="text-green-600 text-xs">已通過</span>
                      )}

                      {registration.status === RegistrationStatus.REJECTED && (
                        <span className="text-red-600 text-xs">已拒絕</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 展開的詳細資訊 */}
                {selectedId === registration.id && (
                  <div className="p-4 bg-gray-50 text-sm border-t">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-gray-500 mb-1">Email:</p>
                        <p>{registration.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">負責人聯絡電話:</p>
                        <p>{registration.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人備註:</p>
                        <p>{registration.notes}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <div>
                        <p className="text-gray-500 mb-1">申請人學生證正面:</p>
                        {!(
                          String(
                            registration.studentCardFront,
                          ).toLowerCase() === "false"
                        ) ? (
                          <img
                            src={
                              CDN_URL && registration.studentCardFront
                                ? CDN_URL + registration.studentCardFront
                                : ""
                            }
                            alt="Student Card Front"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          "無資料"
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人學生證反面:</p>
                        {!(
                          String(registration.studentCardBack).toLowerCase() ===
                          "false"
                        ) ? (
                          <img
                            src={
                              CDN_URL && registration.studentCardBack
                                ? CDN_URL + registration.studentCardBack
                                : ""
                            }
                            alt="Student Card Back"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          "無資料"
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人身分證正面:</p>
                        {!(
                          String(registration.idDocumentFront).toLowerCase() ===
                          "false"
                        ) ? (
                          <img
                            src={
                              CDN_URL && registration.idDocumentFront
                                ? CDN_URL + registration.idDocumentFront
                                : ""
                            }
                            alt="ID Document Front"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          "無資料"
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人身分證反面:</p>
                        {!(
                          String(registration.idDocumentBack).toLowerCase() ===
                          "false"
                        ) ? (
                          <img
                            src={
                              CDN_URL && registration.idDocumentBack
                                ? CDN_URL + registration.idDocumentBack
                                : ""
                            }
                            alt="ID Document Back"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          "無資料"
                        )}
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">申請人護照:</p>
                        {!(
                          String(
                            registration.idDocumentPassport,
                          ).toLowerCase() === "false"
                        ) ? (
                          <img
                            src={
                              CDN_URL && registration.idDocumentPassport
                                ? CDN_URL + registration.idDocumentPassport
                                : ""
                            }
                            alt="ID Document Passport"
                            className="w-32 h-32 object-cover rounded-md mb-2"
                          />
                        ) : (
                          "無資料"
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex justify-end gap-3">
                      {registration.status === RegistrationStatus.PENDING && (
                        <>
                          <button
                            // onClick={() => handleApprove(registration.id)}
                            className="px-4 py-1.5 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 shadow-sm"
                          >
                            通過
                          </button>
                          <button
                            // onClick={() => handleReject(registration.id)}
                            className="px-4 py-1.5 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 shadow-sm"
                          >
                            拒絕
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
      <br />
    </div>
  );
}
