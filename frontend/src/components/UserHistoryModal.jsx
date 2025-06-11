import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";
import dayjs from "dayjs";

const UserHistoryModal = ({ isOpen, onClose, user }) => {
  const [allHistory, setAllHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen && user?.id) {
      axiosInstance
        .get("/admin/user/history", { params: { userId: user.id } })
        .then((res) => {
          setAllHistory(res.data);
          setCurrentPage(1); // 모달 열 때 1페이지로 초기화
        })
        .catch((err) => {
          console.error("대출 이력 조회 실패:", err);
          setAllHistory([]);
        });
    }
  }, [isOpen, user]);

  if (!user) return null;

  // 현재 페이지에 보여줄 데이터 계산
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentHistory = allHistory.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(allHistory.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <h2 className="text-xl font-bold mb-4">대출 이력 상세보기</h2>

        {allHistory.length === 0 ? (
          <p className="text-gray-500">대출 이력이 없습니다.</p>
        ) : (
          <>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr>
                  <th className="border px-2 py-1 text-left">대출ID</th>
                  <th className="border px-2 py-1 text-left">책이름</th>
                  <th className="border px-2 py-1 text-left">대출자</th>
                  <th className="border px-2 py-1 text-left">빌린날</th>
                  <th className="border px-2 py-1 text-left">마감일</th>
                  <th className="border px-2 py-1 text-left">상태</th>
                </tr>
              </thead>
              <tbody>
                {currentHistory.map((item) => (
                  <tr key={item.borrowId} className="hover:bg-gray-100">
                    <td className="border px-2 py-1">{item.borrowId}</td>
                    <td className="border px-2 py-1">{item.bookName}</td>
                    <td className="border px-2 py-1">{item.borrower}</td>
                    <td className="border px-2 py-1">{dayjs(item.createDate).format("YYYY년 MM월 DD일 HH:mm:ss")}</td>
                    <td className="border px-2 py-1">{dayjs(item.deadLine).format("YYYY년 MM월 DD일 HH:mm:ss")}</td>
                    <td
                    className={`p-4 border-b font-semibold ${
                        item.status === "OVERDUE"
                        ? "text-red-600"
                        : item.status === "RETURN"
                        ? "text-gray-600"
                        : "text-green-600"
                    }`}
                    >
                    {item.status === "OVERDUE"
                        ? "연체"
                        : item.status === "RETURN"
                        ? "반납 완료"
                        : "대출 중"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center gap-2 mb-4">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === idx + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
        >
          닫기
        </button>
      </div>
    </Modal>
  );
};

export default UserHistoryModal;
