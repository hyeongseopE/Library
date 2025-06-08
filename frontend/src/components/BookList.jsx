import React, { useState } from "react";

function BookList({ books }) {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // 현재 페이지에 보여줄 책 리스트 계산
  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentBooks = books.slice(startIdx, endIdx);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  return (
    <div className="w-full max-w-none mx-auto p-4">
      <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">도서 목록</h2>

      <ul className="w-full space-y-4">
        {currentBooks.map((book, idx) => (
          <li
            key={startIdx + idx}
            className="w-full max-w-4xl mx-auto flex flex-col md:flex-row md:justify-between items-start md:items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="flex flex-col space-y-1 md:w-3/4">
              <h3 className="text-xl font-bold text-blue-700">{book.name}</h3>
              <p className="text-gray-600">
                저자: <span className="font-medium">{book.writer}</span> | 출판사:{" "}
                <span className="font-medium">{book.publisher}</span>
              </p>
              <p className="text-gray-500 text-sm">출판일: {book.createDate}</p>
            </div>

            <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end space-y-1 md:w-1/4 text-right">
              <p className="text-lg font-semibold text-gray-800">{book.price?.toLocaleString()}원</p>
              <p
                className={`text-sm font-semibold ${
                  book.status === "AVAILABLE" ? "text-green-600" : "text-red-600"
                }`}
              >
                {book.status === "AVAILABLE" ? "대출 가능" : "대출 불가능"}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md font-medium border ${
            page === 1
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-blue-500 text-blue-600 hover:bg-blue-100"
          }`}
        >
          이전
        </button>

        <span className="font-semibold text-gray-700">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md font-medium border ${
            page === totalPages || totalPages === 0
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-blue-500 text-blue-600 hover:bg-blue-100"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default BookList;
