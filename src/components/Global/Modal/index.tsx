// components/Modal.tsx
import React, { useState } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    buttons: {
        label: string;
        onClick: () => void;
        variant?: "primary" | "secondary" | "danger";
    }[];
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, buttons }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          {children}
        </div>

        <div className="flex justify-end space-x-2">
          {buttons.map((button, index) => {
            let buttonClass = "px-4 py-2 rounded-md font-medium focus:outline-none transition-colors";

            switch (button.variant) {
              case "primary":
                buttonClass += " bg-blue-600 hover:bg-blue-700 text-white";
                break;
              case "danger":
                buttonClass += " bg-red-600 hover:bg-red-700 text-white";
                break;
              case "secondary":
              default:
                buttonClass += " bg-gray-200 hover:bg-gray-300 text-gray-800";
                break;
            }

            return (
              <button
                key={index}
                onClick={button.onClick}
                className={buttonClass}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;

// Example Usage:
// components/ExampleModalUsage.tsx
// import { useState } from 'react';
// import Modal from './Modal';

// export default function ExampleModalUsage() {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false);

//     const handleConfirm = () => {
//         // Do something when confirm is clicked
//         console.log('Confirmed!');
//         closeModal();
//     };

//     return (
//         <div className="p-6">
//             <button
//                 onClick={openModal}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             >
//                 打開彈跳視窗
//             </button>

//             <Modal
//                 isOpen={isModalOpen}
//                 onClose={closeModal}
//                 title="確認操作"
//                 buttons={[
//                     {
//                         label: '取消',
//                         onClick: closeModal,
//                         variant: 'secondary'
//                     },
//                     {
//                         label: '確認',
//                         onClick: handleConfirm,
//                         variant: 'primary'
//                     }
//                 ]}
//             >
//                 <p>您確定要執行此操作嗎？</p>
//             </Modal>
//         </div>
//     );
// }