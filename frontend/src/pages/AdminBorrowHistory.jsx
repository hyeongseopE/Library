import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook } from "react-icons/fa";
import axiosInstance from "./AxiosInstance";
import BookReturnModal from "../components/BookReturnModal"; // 추가
import dayjs from "dayjs";

const AdminBorrowHistory = () => {
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false); // 모달 상태
  const navigate = useNavigate();

  const fetchBorrowHistory = async () => {
    try {
      const res = await axiosInstance.get("/admin/borrow/history");
      setBorrowHistory(res.data);
    } catch (err) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/adminLogin");
      console.error("대출 내역 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-12">
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📖 대출 내역 관리 페이지</h1>
          <button
            onClick={() => setIsReturnModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl"
          >
            📖 반납 신청
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 border-b text-left">대출 ID</th>
              <th className="p-4 border-b text-left">회원 이름</th>
              <th className="p-4 border-b text-left">책 이름</th>
              <th className="p-4 border-b text-left">대출일</th>
              <th className="p-4 border-b text-left">마감일</th>
              <th className="p-4 border-b text-left">상태</th>
            </tr>
          </thead>
          <tbody>
            {borrowHistory.map((history) => (
              <tr key={history.borrowId} className="hover:bg-gray-50 transition duration-200">
                <td className="p-4 border-b">{history.borrowId}</td>
                <td className="p-4 border-b">{history.borrower}</td>
                <td className="p-4 border-b">{history.bookName}</td>
                <td className="p-4 border-b">{dayjs(history.createDate).format("YYYY년 MM월 DD일 HH:mm")}</td>
                <td className="p-4 border-b">{dayjs(history.deadLine).format("YYYY년 MM월 DD일 HH:mm")}</td>
                <td
                  className={`p-4 border-b font-semibold ${
                    history.status === "OVERDUE"
                      ? "text-red-600"
                      : history.status === "RETURN"
                      ? "text-gray-600"
                      : "text-green-600"
                  }`}
                >
                  {history.status === "OVERDUE"
                    ? "연체"
                    : history.status === "RETURN"
                    ? "반납 완료"
                    : "대출 중"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 오른쪽 카드 메뉴 */}
      <div className="flex flex-col gap-8 w-56">
        <div
          onClick={() => navigate("/adminUsersPage")}
          className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl shadow-lg p-6 flex flex-col items-center
            hover:brightness-110 hover:scale-105 transition-transform duration-200"
          title="사용자 관리"
        >
          <FaUser className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">사용자 관리</h2>
          <p className="mt-1 text-center text-sm">회원 정보를 관리합니다.</p>
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

        <div
          className="cursor-pointer bg-gradient text-indigo-700 border-2 border-gradient-300 rounded-xl shadow-lg p-6 flex flex-col items-center
            hover:brightness-105 hover:scale-105 transition-transform duration-200"
          title="대출내역 관리"
        >
          <FaBook className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">대출내역 관리</h2>
          <p className="mt-1 text-center text-sm">대출 내역을 확인하고 관리합니다.</p>
        </div>
      </div>

      {/* 반납 신청 모달 */}
      <BookReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        onSuccess={fetchBorrowHistory}
      />
    </div>
  );
};

export default AdminBorrowHistory;
