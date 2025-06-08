import React, { useState } from "react";
import axios from "axios";
import BookList from "../components/BookList";  // 경로 맞춰서

function Home() {
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("제목");
  const [books, setBooks] = useState([]);
  const [mode, setMode] = useState("light");

  const handleMode = () => {
    setMode(prev => (prev === "light" ? "dark" : "light"));
  }

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    console.log(searchText, searchType);
    try {
      const response = await axios.get("/api/user/search", {
        params: { searchText, searchType },
      });
      console.log(response.data);
      setBooks(response.data);
    } catch (error) {
      console.error("검색 에러:", error);
    }
  };

  const handleAllBooks = async () => {
    try {
      const response = await axios.get("/api/user/booklist");
      setBooks(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("전체 책 조회 에러:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={`flex flex-col min-h-screen items-center justify-center ${
        mode === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <h1 className="text-5xl font-bold text-gray-800 mb-10">KHS Library</h1>

      <div className="flex gap-2 mb-4 w-full max-w-4xl mx-auto">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500"
        >
          <option value="제목">제목</option>
          <option value="저자">저자</option>
          <option value="출판사">출판사</option>
        </select>

        <input
          type="text"
          placeholder="도서를 검색하세요 !"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full max-w px-6 py-4 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleAllBooks}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md shadow"
        >
          책 한눈에 보러가기
        </button>
        <button
          onClick={handleMode}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md shadow"
        >
          I'm Feeling Lucky
        </button>
      </div>

      {books.length > 0 && <BookList books={books} />}
    </div>
    
  );
}

export default Home;
