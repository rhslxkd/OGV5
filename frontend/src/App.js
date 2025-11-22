import logo from './logo.svg';
import './App.css';
import {Route, Routes, Navigate, useLocation} from "react-router-dom";

import RequiredAuth from "./components/RequiredAuth";
import Header from "./lib/Header";
import Footer from "./lib/Footer";
import ForbiddenPage from "./pages/regist/ForbiddenPage";
import Board from "./pages/board/Board";
import AddBoard from "./pages/board/AddBoard";
import BoardDetail from "./pages/board/BoardDetail";
import BoardEdit from "./pages/board/BoardEdit";
import Movie from "./pages/movie/Movie";
import AddMovie from "./pages/movie/AddMovie";
import MovieDetail from "./pages/movie/MovieDetail";
import MovieEdit from "./pages/movie/MovieEdit";
import Home from "./pages/home/Home";
import HomeMovieDetail from "./pages/home/HomeMovieDetail";
import RegisterForm from "./pages/regist/RegisterForm";
import LoginForm from "./pages/regist/LoginForm";
import Mypage from "./pages/regist/Mypage";
import MyBookingPage from "./pages/booking/MyBookingPage";

function App() {
    const loc = useLocation();
    const hideHeader = ["/login", "/register"].includes(loc.pathname);
  return (
    <div className="App">
        {hideHeader && <Header />}
            <Routes>
                {/*없는데 치거나 /을 치면 home으로 보내기*/}
                <Route path="*" element={<Navigate to="/" replace /> } />
                <Route path="/forbidden" element={<ForbiddenPage />} />

                <Route element={<RequiredAuth />}>
                    {/*인증이 필요한 페이지들*/}
                    {/*게시판*/}
                    <Route path="/board" element={<Board />} />
                    <Route path="/addboard" element={<AddBoard />} />
                    <Route path="board/:id" element={<BoardDetail/>}  /> {/*뒤쪽 사이트가 이제 http:d....board/102이런느낌으로 된다는듯*/}
                    <Route path="boardEdit/:id" element={<BoardEdit/>} />
                    {/* 여기서 리스트 컴포넌트 렌더링 */}
                    {/* 영화*/}
                    <Route path="/movie" element={<Movie />} />
                    <Route path="/addMovie" element={<AddMovie />} />
                    <Route path="movie/:id" element={<MovieDetail />} />
                    <Route path="movieEdit/:id" element={<MovieEdit />} />
                    {/*홈*/}
                    <Route path="/" element={<Home />} />
                    <Route path="/movies/:id" element={<HomeMovieDetail />} />
                </Route>
                {/*회원*/}
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/mypage/bookings" element={<MyBookingPage />} />
            </Routes>
        <Footer />
    </div>
  );
}

export default App;
