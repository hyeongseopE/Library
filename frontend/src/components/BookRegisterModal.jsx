import React, { useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";

const BookRegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    bookName: "",
    writer: "",
    publisher: "",
    price: "" // 문자열로 초기화
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value // 문자열 그대로 저장
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseInt(formData.price || "0", 10) // 전송 시 숫자로 변환
      };

      await axiosInstance.post("/admin/book/register", payload);
      alert("✅ 책 등록 완료!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ 책 등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">📚 책 등록</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">책 이름</label>
            <input
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              placeholder="책 제목 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">저자</label>
            <input
              name="writer"
              value={formData.writer}
              onChange={handleChange}
              placeholder="저자 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">출판사</label>
            <input
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="출판사 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">가격</label>
            <input
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="가격 입력"
              className="w-full p-2 border rounded"
              required
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BookRegisterModal;
