import React, { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";

import { FaUser, FaBook } from "react-icons/fa";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/admin/userpage");
        setUsers(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("사용자 목록 불러오기 실패:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-12">
      {/* 좌측: 사용자 테이블 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">👤 사용자 관리 페이지</h1>
          <button
            onClick={() => alert("👤 사용자 등록 기능 구현 예정")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
          >
            👤 사용자 등록
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 border-b text-left">ID</th>
              <th className="p-4 border-b text-left">이름</th>
              <th className="p-4 border-b text-left">이메일</th>
              <th className="p-4 border-b text-left">전화번호</th>
              <th className="p-4 border-b text-left">비밀번호</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-200">
                <td className="p-4 border-b">{user.id}</td>
                <td className="p-4 border-b">{user.name}</td>
                <td className="p-4 border-b">{user.email}</td>
                <td className="p-4 border-b">{user.tel}</td>
                <td className="p-4 border-b text-gray-400 italic">암호화됨</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 우측: 카드형 버튼 세로 배치 */}
     <div className="flex flex-col gap-8 w-56">
        <div
          onClick={() => navigate("/adminUsersPage")}
          className="cursor-pointer rounded-xl p-6 flex flex-col items-center bg-white text-purple-700 shadow-lg border-2 border-purple-300 transition duration-200"
          title="사용자 관리"
        >
          <FaUser className="mb-2 text-4xl" />
          <h2 className="text-xl font-semibold">사용자 관리</h2>
          <p className="mt-1 text-center text-sm text-purple-600">
            회원 정보를 관리합니다.
          </p>
        </div>

        <div
          onClick={() => navigate("/adminPage")}
          className="cursor-pointer bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:brightness-110 hover:scale-105 transition-transform duration-200"
          title="책 관리"
        >
          <FaBook className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">책 관리</h2>
          <p className="mt-1 text-center text-sm">도서 등록과 수정 관리</p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
