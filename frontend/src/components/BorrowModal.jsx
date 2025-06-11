import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";
import dayjs from "dayjs";

const BorrowModal = ({ isOpen, onClose, loan }) => {
  const [borrowerId, setBorrowerId] = useState("");
  const [borrowInfo, setBorrowInfo] = useState(null);

  useEffect(() => {
    const fetchBorrowInfo = async () => {
      if (loan?.status === "NOTAVAILABLE") {
        try {
          const res = await axiosInstance.get(`/admin/borrow/book/${loan.id}`);
          setBorrowInfo(res.data);
        } catch (err) {
          console.error("대출 정보 조회 실패", err);
        }
      }
    };

    if (isOpen) {
      fetchBorrowInfo();
    }
  }, [loan, isOpen]);

  const handleLoanRequest = async () => {
    try {
      await axiosInstance.post("/admin/book/borrow", {
        bookId: loan.id,
        user: borrowerId,
      });
      alert(`"${loan.name}" 대출 신청 완료: 신청자 - ${borrowerId}`);
      onClose();
      window.location.reload();
    } catch (error) {
      console.log("대출 신청 실패:", error);
      alert("대출 신청 중 오류 발생");
    }
  };

  const handleReturnRequest = async () => {
    try {
      console.log(borrowInfo.userId);
      await axiosInstance.post("/admin/book/return", {
        bookId: loan.id,
        userId: borrowInfo.userId,
        borrowId: null,
      });
      alert(`"${loan.name}" 반납 신청 완료`);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("반납 신청 실패:", error);
      alert("반납 신청 중 오류 발생");
    }
  };

  if (!loan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {loan.status === "AVAILABLE" ? (
        <div>
          <h2 className="text-xl font-bold mb-4">대출 신청: {loan.name}</h2>
          <input
            type="text"
            placeholder="신청자 Id 입력"
            value={borrowerId}
            onChange={(e) => setBorrowerId(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleLoanRequest}
            disabled={!borrowerId.trim()}
            className={`w-full py-2 rounded text-white ${
              borrowerId.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            대출 신청
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">{loan.name} 대출 중</h2>
          {borrowInfo ? (
            <div className="space-y-2 mb-4">
              <p>
                <span className="font-semibold">대출자 ID:</span> {borrowInfo.userId}
              </p>
              <p>
                <span className="font-semibold">이름:</span> {borrowInfo.userName}
              </p>
              <p>
                <span className="font-semibold">대출일:</span> {dayjs(borrowInfo.createDate).format("YYYY년 MM월 DD일 HH:mm")}
              </p>
              <p>
                <span className="font-semibold">마감일:</span> {dayjs(borrowInfo.deadLine).format("YYYY년 MM월 DD일 HH:mm")}
              </p>
            </div>
          ) : (
            <p className="mb-4">대출 정보를 불러오는 중...</p>
          )}
          <button
            onClick={handleReturnRequest}
            className="w-full py-2 rounded text-white bg-red-600 hover:bg-red-700"
          >
            반납 신청
          </button>
        </div>
      )}
    </Modal>
  );
};

export default BorrowModal;
