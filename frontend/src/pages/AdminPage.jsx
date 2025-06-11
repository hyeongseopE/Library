import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook } from "react-icons/fa";
import axiosInstance from "./AxiosInstance";
import BorrowModal from "../components/BorrowModal";
import BookRegisterModal from "../components/BookRegisterModal";
import dayjs from "dayjs";
import BookEditModal from "../components/BookEditModal";

const AdminPage = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  // 책 등록/수정 관련
  const [bookRegisterModalOpen, setBookRegisterModalOpen] = useState(false);
  const [bookEditModalOpen, setBookEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // 데이터 가져오기
  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/admin/bookpage");
      setLoans(res.data);
    } catch (err) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/adminLogin");
      console.error("대출 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 검색
  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get("/admin/book/search", {
        params: { searchText: searchTerm },
      });
      setLoans(res.data);
    } catch (err) {
      console.error("검색 실패:", err);
      alert("검색 중 오류가 발생했습니다.");
    }
  };

  // 상태 라벨
  const getStatusLabel = (status) => {
    switch (status) {
      case "AVAILABLE":
        return { text: "대출 가능", color: "text-green-600" };
      case "NOTAVAILABLE":
        return { text: "대출 중", color: "text-yellow-600" };
      case "OVERDUE":
        return { text: "연체", color: "text-red-600" };
      default:
        return { text: "알 수 없음", color: "text-gray-600" };
    }
  };

  // 대출 모달 열기/닫기
  const BorrowModalOpen = (loan) => {
    setSelectedLoan(loan);
    setBorrowModalOpen(true);
  };
  const BorrowModalClose = () => {
    setSelectedLoan(null);
    setBorrowModalOpen(false);
  };

  // 책 등록 모달 열기/닫기
  const openBookRegisterModal = () => {
    setSelectedBook(null);
    setBookRegisterModalOpen(true);
  };
  const closeBookRegisterModal = () => {
    setBookRegisterModalOpen(false);
  };

  // 책 수정 모달 열기/닫기
  const openBookEditModal = (book) => {
    setSelectedBook(book);
    setBookEditModalOpen(true);
  };
  const closeBookEditModal = () => {
    setSelectedBook(null);
    setBookEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-12">
      {/* 왼쪽: 대출 관리 테이블 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📚 책 관리 페이지</h1>
          <button
            onClick={openBookRegisterModal}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl"
          >
            📖 책 등록
          </button>
        </div>

        {/* 검색바 */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="책 이름, 출판사 또는 저자명으로 검색"
            className="w-full p-2 border rounded-lg focus:outline-teal-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 rounded-lg hover:bg-teal-700 whitespace-nowrap"
          >
            검색
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
                <tr
                  key={loan.id}
                  className="hover:bg-gray-50 cursor-pointer transition duration-200"
                  onClick={() => openBookEditModal(loan)}
                >
                  <td className="p-4 border-b">{loan.id}</td>
                  <td className="p-4 border-b">{loan.name}</td>
                  <td className="p-4 border-b">{loan.writer}</td>
                  <td className="p-4 border-b">{loan.publisher}</td>
                  <td className="p-4 border-b">
                    {dayjs(loan.createDate).format("YYYY년 MM월 DD일")}
                  </td>
                  <td className="p-4 border-b">{loan.price?.toLocaleString()}원</td>
                  <td className={`p-4 border-b font-semibold ${status.color}`}>
                    {status.text}
                  </td>
                  <td className="p-4 border-b">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 행 클릭 이벤트 막기
                      BorrowModalOpen(loan);
                    }}
                    className={`px-3 py-1 rounded text-white 
                      ${status.text === "대출 가능" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-gray-500 hover:bg-gray-600"}`}
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
        >
          <FaUser className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">사용자 관리</h2>
          <p className="mt-1 text-center text-sm">회원 정보를 관리합니다.</p>
        </div>

        <div
          onClick={() => navigate("/adminPage")}
          className="cursor-pointer rounded-xl p-6 flex flex-col items-center bg-white text-teal-700 shadow-lg border-2 border-teal-300"
        >
          <FaBook className="mb-2 text-4xl" />
          <h2 className="text-xl font-semibold">책 관리</h2>
          <p className="mt-1 text-center text-sm text-teal-600">도서 등록과 수정 관리</p>
        </div>

        <div
          onClick={() => navigate("/adminBorrowHistory")}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-6 flex flex-col items-center
            hover:brightness-110 hover:scale-105 transition-transform duration-200"
        >
          <FaBook className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">대출내역 관리</h2>
          <p className="mt-1 text-center text-sm">대출 내역을 확인하고 관리합니다.</p>
        </div>
      </div>

      {/* 모달들 */}
      <BorrowModal isOpen={borrowModalOpen} onClose={BorrowModalClose} loan={selectedLoan} />

      {/* 책 등록 모달 */}
      <BookRegisterModal
        isOpen={bookRegisterModalOpen}
        onClose={closeBookRegisterModal}
        onSuccess={fetchData}
      />

      {/* 책 수정 모달 */}
      {selectedBook && (
        <BookEditModal
          isOpen={bookEditModalOpen}
          onClose={closeBookEditModal}
          onSuccess={() => {
            fetchData();
            closeBookEditModal();
          }}
          bookData={selectedBook}
        />
      )}
    </div>
  );
};

export default AdminPage;
