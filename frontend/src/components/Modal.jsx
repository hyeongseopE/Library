import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black"
        style={{ opacity: 0.2 }} // <-- 여기서 원하는 밝기로 조정
        onClick={onClose}
      />

      {/* 모달 내용 */}
      <div className="relative z-[60] bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        {children}
      </div>
    </div>
  );
};


export default Modal;
