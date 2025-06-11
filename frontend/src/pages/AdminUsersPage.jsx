import React, { useEffect, useState } from "react";
import axiosInstance from "./AxiosInstance";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBook } from "react-icons/fa";
import UsersModal from "../components/UsersModal";
import UserRegisterModal from "../components/UserRegisterModal";
import UserHistoryModal from "../components/UserHistoryModal"; // 추가

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false); // 추가
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/userpage");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/adminLogin");
      console.error("사용자 목록 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  const openRegisterModal = () => setRegisterModalOpen(true);
  const closeRegisterModal = () => setRegisterModalOpen(false);

  const openHistoryModal = (user) => {
    setSelectedUser(user);
    setHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setSelectedUser(null);
    setHistoryModalOpen(false);
  };

  const handleSearch = async () => {
    try {
      const res = await axiosInstance.get("/admin/user/search", {
        params: { searchText: searchTerm },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
      console.log("검색된 데이터:", res.data);
    } catch (err) {
      console.log("검색 실패:", err);
      alert("검색중 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-12">
      {/* 좌측: 사용자 테이블 */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">👤 사용자 관리 페이지</h1>
          <button
            onClick={openRegisterModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl"
          >
            👤 사용자 등록
          </button>
        </div>

        {/* 검색바 */}
        <div className="flex items-center justify-end mb-4 gap-2">
          <input
            type="text"
            placeholder="id,이메일 및 이름으로 검색"
            className="w-full p-2 border rounded-lg focus:outline-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 whitespace-nowrap"
          >
            검색
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
              <th className="p-4 border-b text-left">상세보기</th>
              <th className="p-4 border-b text-left">대출이력</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition duration-200">
                <td className="p-4 border-b">{user.id}</td>
                <td className="p-4 border-b">{user.name}</td>
                <td className="p-4 border-b">{user.email}</td>
                <td className="p-4 border-b">{user.tel}</td>
                <td className="p-4 border-b text-gray-400 italic">암호화됨</td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => openModal(user)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    상세 보기
                  </button>
                </td>
                <td className="p-4 border-b">
                  <button
                    onClick={() => openHistoryModal(user)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    대출이력
                  </button>
                </td>
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

        <div
          onClick={() => navigate("/adminBorrowHistory")}
          className="cursor-pointer bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg p-6 flex flex-col items-center
            hover:brightness-110 hover:scale-105 transition-transform duration-200"
          title="대출내역 관리"
        >
          <FaBook className="text-4xl mb-2" />
          <h2 className="text-xl font-semibold">대출내역 관리</h2>
          <p className="mt-1 text-center text-sm">대출 내역을 확인하고 관리합니다.</p>
        </div>
      </div>

      {/* 사용자 상세 모달 */}
      <UsersModal isOpen={modalOpen} onClose={closeModal} user={selectedUser} />

      {/* 사용자 등록 모달 */}
      <UserRegisterModal
        isOpen={registerModalOpen}
        onClose={closeRegisterModal}
        onUserAdded={fetchUsers}
      />

      {/* 대출 이력 모달 */}
      <UserHistoryModal
        isOpen={historyModalOpen}
        onClose={closeHistoryModal}
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUsersPage;
