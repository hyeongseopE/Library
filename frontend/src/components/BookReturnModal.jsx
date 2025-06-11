import React, { useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";

const BookReturnModal = ({ isOpen, onClose, onSuccess }) => {
  const [bookId, setBookId] = useState("");
  const [userId, setUserId] = useState("");
  const [borrowId, setBorrowId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!borrowId && (!bookId || !userId)) {
      alert("대출 ID 또는 도서 ID와 회원 ID를 입력해야 합니다.");
      return;
    }

    try {
      await axiosInstance.post("/admin/book/return", {
        bookId: bookId ? parseInt(bookId) : null,
        userId: userId ? parseInt(userId) : null,
        borrowId: borrowId ? parseInt(borrowId) : null,
      });
      alert("✅ 반납 신청 완료!");
      onClose();
      onSuccess();
    } catch (error) {
      console.error("❌ 반납 신청 실패:", error);
      alert("반납 신청 중 오류가 발생했습니다.");
    }
  };

  const isBorrowIdPresent = borrowId.trim() !== "";

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">📦 반납 신청</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">책 ID</label>
            <input
              type="number"
              min="1"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="책 ID 입력"
              className="w-full p-2 border rounded"
              disabled={isBorrowIdPresent}
              required={!isBorrowIdPresent}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">회원 ID</label>
            <input
              type="number"
              min="1"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="회원 ID 입력"
              className="w-full p-2 border rounded"
              disabled={isBorrowIdPresent}
              required={!isBorrowIdPresent}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">대출 ID</label>
            <input
              type="number"
              min="1"
              value={borrowId}
              onChange={(e) => setBorrowId(e.target.value)}
              placeholder="회원ID 및 도서ID 가 기억나지 않으면 대출ID를 입력하세요!"
              className="w-full p-2 border rounded"
              required={!bookId || !userId}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              신청
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BookReturnModal;
