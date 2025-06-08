import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook } from "react-icons/fa";
import axiosInstance from "./AxiosInstance";
import BorrowModal from "../components/BorrowModal";

const AdminPage = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.post("/admin/mainpage");
        setLoans(res.data);
      } catch (err) {
        console.error("대출 목록 불러오기 실패:", err);
      }
    };

    fetchData();
  }, []);

  const getStatusLabel = (status) => {
    switch (status) {
      case "AVAILABLE":
        return { text: "대출 가능", color: "text-green-600" };
      case "NOTAVAILABLE":
        return { text: "대출 중", color: "text-yellow-600" };
      default:
        return { text: "알 수 없음", color: "text-gray-600" };
    }
  };

  const openModal = (loan) => {
    setSelectedLoan(loan);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLoan(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-12">
      {/* 왼쪽: 대출 관리 테이블 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 대출 관리 페이지</h1>
          <button
            onClick={() => alert("📖 책 등록 기능 구현 예정")}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
          >
            📖 책 등록
          </button>
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-4 border-b text-left">책 ID</th>
              <th className="p-4 border-b text-left">책 이름</th>
              <th className="p-4 border-b text-left">저자</th>
              <th className="p-4 border-b text-left">출판사</th>
              <th className="p-4 border-b text-left">출판일</th>
              <th className="p-4 border-b text-left">가격</th>
              <th className="p-4 border-b text-left">상태</th>
              <th className="p-4 border-b text-left">액션</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const status = getStatusLabel(loan.status);
              return (
                <tr key={loan.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="p-4 border-b">{loan.id}</td>
                  <td className="p-4 border-b">{loan.name}</td>
                  <td className="p-4 border-b">{loan.writer}</td>
                  <td className="p-4 border-b">{loan.publisher}</td>
                  <td className="p-4 border-b">{loan.createDate}</td>
                  <td className="p-4 border-b">{loan.price?.toLocaleString()}원</td>
                  <td className={`p-4 border-b font-semibold ${status.color}`}>{status.text}</td>
                  <td className="p-4 border-b">
                    <button
                      onClick={() => openModal(loan)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      {status.text === "대출 가능" ? "대출 신청" : "상세 보기"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 오른쪽: 카드형 버튼 세로 배치 */}
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
          className={`cursor-pointer rounded-xl p-6 flex flex-col items-center transition duration-200
            bg-white text-teal-700 shadow-lg border-2 border-teal-300
          `}
          title="책 관리"
        >
          <FaBook
            className={`mb-2 text-4xl transition-colors duration-200 
              text-teal-700 `}
          />
          <h2 className={`text-xl font-semibold transition-colors duration-200`}>
            책 관리
          </h2>
          <p className={`mt-1 text-center text-sm transition-colors duration-200 
            text-teal-600
          `}>
            도서 등록과 수정 관리
          </p>
        </div>
      </div>

      {/* 모달 */}
      <BorrowModal isOpen={modalOpen} onClose={closeModal} loan={selectedLoan} />
    </div>
  );
};

export default AdminPage;
