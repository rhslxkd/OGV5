import {useState, useEffect} from "react";
import Pagination from "../../components/Pagination";
import {Link, useNavigate} from "react-router-dom"; //React 안에서 페이지 이동을 하겠다(http쪽 페이지)

import {fetcher} from "../../lib/fetcher";

function Movie() {
    const [user, setUser] = useState(() => {
        const  uuser = sessionStorage.getItem("user");
        return uuser ? JSON.parse(uuser): null;
    });

    const [movie, setMovie] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true); //로딩 상태 표시
    const [error, setError] = useState(null); //에러 메시지 표시
    const navigate = useNavigate();

    useEffect(() => { //비동기면 안됨.
        (async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('영화임니당')
                const data = await fetcher(`http://localhost:8080/api/movie/main?page=${page - 1}`);
                if (!data) return;
                setMovie(data.contents);
                setTotalPages(data.totalPages);
            } catch (e) {
                if (e.status === 403) {
                    navigate("/forbidden", {replace :true});
                }
                setError(e.message)
            } finally {
                setLoading(false);
            }
        })();
    }, [page]);
    if (error) return <div className="text-danger">에러: {error}</div>;
    if (!movie) return <div>로딩중...</div>;
    return (
        <div className="container py-4"> {/* 상하 여백 */}
            {/* 헤더 바: 제목 + 액션 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h1 className="h3 m-0 d-flex align-items-center gap-2">
                    <i className="fa-solid fa-clapperboard"></i> 영화 관리
                </h1>
                <div className="btn-group" role="group" aria-label="actions">
                    {user?.role === "ROLE_ADMIN" && (
                        <Link to="/board" className="btn btn-primary">
                            <i className="fa-solid fa-arrow-right me-2"></i>게시판
                        </Link>
                    )}
                    {user?.role === "ROLE_ADMIN" && (
                        <Link to="/addMovie" className="btn btn-primary">
                            <i className="fa-solid fa-plus me-2"></i>영화 추가
                        </Link>
                    )}
                    <Link to="/" className="btn btn-secondary">
                        <i className="fa-solid fa-file-import me-2"></i>메인으로
                    </Link>
                </div>
            </div>

            {/* 카드 래퍼: 음영 + 라운드 */}
            <div className="card shadow-sm">
                <div className="card-body">

                    {/* 상태 영역 */}
                    {loading && (
                        <div className="text-secondary py-5 text-center">
                            <i className="fa-solid fa-spinner fa-spin me-2"></i>불러오는 중...
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <i className="fa-solid fa-triangle-exclamation me-2"></i>
                            {error}
                        </div>
                    )}
                    {!loading && !error && movie.length === 0 && (
                        <div className="text-muted py-5 text-center">
                            <i className="fa-regular fa-face-meh-blank me-2"></i>
                            등록된 영화가 없습니다.
                        </div>
                    )}

                    {/* 테이블 */}
                    {!loading && !error && movie.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th style={{width: 120}}>영화 ID</th>
                                    <th>영화 제목</th>
                                    <th style={{width: 220}}>영화 감독</th>
                                    <th style={{width: 140}} className="text-end">상영시간</th>
                                </tr>
                                </thead>
                                <tbody>
                                {movie.map(m => (
                                    <tr key={m.movie_id}>
                                        <td className="text-muted">{m.movie_id}</td>
                                        <td>
                                            <Link to={`/movie/${m.movie_id}`} className="text-decoration-none">
                                                <i className="fa-regular fa-file-lines me-2"></i>
                                                <span className="fw-semibold">{m.title}</span>
                                            </Link>
                                        </td>
                                        <td>
                                            <i className="fa-solid fa-user-tie me-2 text-secondary"></i>
                                            {m.director}
                                        </td>
                                        <td className="text-end">
                        <span className="badge bg-secondary-subtle text-dark">
                          <i className="fa-regular fa-clock me-1"></i>
                            {m.runningMinutes}분
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 페이지네이션: 네 컴포넌트 그대로 사용 */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center pt-2">
                            {/* Pagination 컴포넌트가 부트스트랩 마크업이면 더 좋다. onPageChange만 유지 */}
                            {/* around는 기존 그대로 유지 */}
                            {/* 필요시 버튼에 btn-outline-secondary 등 클래스 주입하도록 컴포넌트 개선 권장 */}
                            {/* 여기선 기존 API 유지 */}
                            {/* eslint-disable-next-line */}
                            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} around={5}/>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
export default Movie;