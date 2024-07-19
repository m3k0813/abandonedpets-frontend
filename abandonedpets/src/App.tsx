import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ShelterPage from './pages/ShelterPage';
import FuneralPage from './pages/FuneralPage';
import Dog from './pages/Dog';
import Cat from './pages/Cat';
import PetDetail from './pages/PetDetail';
import Mypage from './pages/Mypage';
import FavoriteList from './components/mypage/FavoriteList';
import PetWrite from './pages/PetWrite';
// import TokenRefresher from './auth/TokenRefresher';

function App() {
  return (
    <>
      <BrowserRouter>
        {/* <TokenRefresher /> */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/shelter" element={<ShelterPage />} />
          <Route path="/funeral" element={<FuneralPage />} />
          <Route path="/dog" element={<Dog />} />
          <Route path="/cat" element={<Cat />} />
          <Route path="/detail/:id" element={<PetDetail />} />
          <Route path="/petwrite" element={<PetWrite />} />
          <Route path="/mypage" element={<Mypage />} />
          {/* chat는 모달이라 확인용 추후 지워줘야 함 */}
          <Route path="favoritelist" element={<FavoriteList />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
