import React, { useState } from "react";
import Modal from "./Modal";
import axiosInstance from "../pages/AxiosInstance";

const BorrowModal = ({ isOpen, onClose, loan }) => {
  const [borrowerName, setBorrowerName] = useState("");

  const handleLoanRequest = async() => {
  
    try{
      const res = await axiosInstance.post("/admin/borrow",{
        bookId: loan.id,
      });
      alert(`"${loan.name}" 대출 신청 완료: 신청자 - ${borrowerName}`);
      onClose();
    } catch(error){
      console.log("대출 신청 실패:",error);
      alert("대출 신청 중 오류 발생");
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
            placeholder="신청자 이름 입력"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={handleLoanRequest}
            disabled={!borrowerName.trim()}
            className={`w-full py-2 rounded text-white ${
              borrowerName.trim()
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
          <p>
            현재 대출자: <span className="font-semibold">{loan.borrower}</span>
          </p>
          <p>
            마감일: <span className="font-semibold">{loan.deadLine}</span>
          </p>
        </div>
      )}
    </Modal>
  );
};

export default BorrowModal;
