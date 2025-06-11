import React, { useState, useEffect } from "react";
import axiosInstance from "../pages/AxiosInstance";
import Modal from "./Modal";

const BookEditModal = ({ isOpen, onClose, onSuccess, bookData }) => {
  const [name, setName] = useState("");
  const [writer, setWriter] = useState("");
  const [publisher, setPublisher] = useState("");
  const [createDate, setCreateDate] = useState("");
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (bookData) {
      setId(bookData.id);
      setName(bookData.name || "");
      setWriter(bookData.writer || "");
      setPublisher(bookData.publisher || "");
      setCreateDate(bookData.createDate ? bookData.createDate.slice(0, 10) : "");
      setPrice(bookData.price || "");
    }
  }, [bookData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/admin/book/update`, {
        id,
        name,
        writer,
        publisher,
        createDate,
        price: Number(price),
      });
      alert("책 정보가 수정되었습니다.");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("책 수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">책 정보 수정</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="책 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="저자"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="출판사"
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={createDate}
          onChange={(e) => setCreateDate(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
          min={0}
        />

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 rounded px-4 py-2"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2"
          >
            수정
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookEditModal;
