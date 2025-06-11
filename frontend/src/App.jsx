import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminPage from './pages/AdminPage.jsx'
import AdminUsersPage from './pages/AdminUsersPage.jsx'
import AdminBorrowHistory from './pages/AdminBorrowHistory.jsx'

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminLogin" element={<AdminLogin />} />
        <Route path='/adminPage' element={<AdminPage />}/>
        <Route path='/adminUsersPage' element={<AdminUsersPage />} />
        <Route path='/adminBorrowHistory' element={<AdminBorrowHistory />}/>
      </Routes>
    </BrowserRouter> 
  
  )
}

export default App
