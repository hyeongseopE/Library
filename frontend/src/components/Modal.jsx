import React from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  width = "max-w-2xl", // 기본 너비: 약 672px
  height = "max-h-[80vh]", // 기본 높이: 80% viewport height
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black"
        style={{ opacity: 0.3 }}
        onClick={onClose}
      />

      {/* 모달 내용 */}
      <div
        className={`relative z-[60] bg-white p-6 rounded-xl shadow-xl w-full ${width} ${height} overflow-y-auto`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
