import React, { useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";

const UserRegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    tel: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/register-user", formData);
      alert("✅ 사용자 등록 완료!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("❌ 사용자 등록 실패:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">👤 사용자 등록</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">이름</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">이메일</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">비밀번호</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">전화번호</label>
            <input
              name="tel"
              value={formData.tel}
              onChange={handleChange}
              placeholder="전화번호 입력"
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

export default UserRegisterModal;
