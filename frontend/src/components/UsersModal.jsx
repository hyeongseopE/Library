import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";

const UsersModal = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [tel, setTel] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPassword(""); // 비밀번호는 항상 새로 입력
      setTel(user.tel || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      await axiosInstance.put("/admin/update-user", {
        id: user.id,
        name,
        password,
        tel,
      });
      alert("사용자 정보가 성공적으로 수정되었습니다.");
      onClose(); // 모달 닫기
      window.location.reload();
    } catch (error) {
      console.error("사용자 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">사용자 정보 수정</h2>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">ID</label>
          <input
            type="text"
            value={user.id}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호 입력"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">전화번호</label>
          <input
            type="text"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          사용자 정보 수정
        </button>
      </div>
    </Modal>
  );
};

export default UsersModal;
