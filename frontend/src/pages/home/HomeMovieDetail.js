import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetcher } from "../lib/fetcher";
import useMe from "../hooks/useMe";
import seatPicker from "../components/seatPicker";
import SeatPicker from "../components/seatPicker";

function HomeMovieDetail() {
    const navigate = useNavigate();
    const params = useParams();
    const mid = params?.id; // URL에서 가져온 영화 ID

    const user = useMe();

    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedShowtime, setSelectedShowtime] = useState(null);

    const [seatPicker, setSeatPicker] = useState(null);

    // 상영시간을 상영관(screenName) 기준으로 그룹핑
    const groupedShowtimes = showtimes.reduce((acc, st) => {
        const screen = st.screenName;
        if (!acc[screen]) acc[screen] = [];
        acc[screen].push(st);
        return acc;
    }, {});

    const availableScreens = Object.keys(groupedShowtimes);

    useEffect(() => {
        if (!mid) return; // mid가 없으면 아무 것도 안 함

        (async () => {
            // 영화 상세 정보
            const movieData = await fetcher(
                `http://localhost:8080/api/home/movies/${mid}`
            );
            if (movieData) setMovie(movieData);

            // 상영 정보
            const showtimeData = await fetcher(
                `http://localhost:8080/api/movies/${mid}/showtimes`
            );
            if (Array.isArray(showtimeData)) setShowtimes(showtimeData);
        })();
    }, [mid]);

    // 아직 영화 데이터가 없으면 렌더링 안 함 (혹은 로딩 스피너 넣어도 됨)
    if (!movie) return null;

    return (
        <div className="container py-4">
            <>
                {/* 헤더 */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h4 m-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-film"></i> 영화 상세
                    </h1>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(`/`)}
                    >
                        <i className="fa-solid fa-list-ul me-2"></i>메인으로
                    </button>
                </div>

                {/* 카드 형태로 포스터 / 내용 표시 */}
                <div className="card shadow-sm border-0">
                    <div className="card-body d-flex flex-column flex-md-row">
                        {/* 포스터 이미지 */}
                        <div className="col-md-4 text-center mb-3 mb-md-0">
                            {movie.posterUrl && (
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://localhost:8080/${movie.posterUrl}`}
                                        alt="poster"
                                        className="rounded shadow-sm img-fluid"
                                        style={{ maxWidth: 320 }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 오른쪽: 상영관 바 + 영화 정보 */}
                        <div className="col-md-8 d-flex flex-column">
                            {/* 상영관 바 */}
                            <div className="mb-3">
                                <div className="d-flex gap-2 flex-wrap">
                                    {availableScreens.map((screenName, st) => (
                                        <div
                                            key={screenName}
                                            className="flex-grow-1 bg-secondary text-white rounded px-3 py-2"
                                        >
                                            <div className="fw-semibold mb-1">
                                                {screenName}
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 small">
                                                {groupedShowtimes[screenName].map((st) => (
                                                    <button
                                                        key={st.showtimeId}
                                                        type="button"
                                                        className={`btn btn-sm ${
                                                            selectedShowtime?.showtimeId === st.showtimeId
                                                                ? "btn-light text-dark"
                                                                : "btn-outline-light text-white"
                                                        }`}
                                                        onClick={() => setSelectedShowtime(st)}
                                                    >
                                                        {st.startsAt} ~ / {st.screenName}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* showtime이 전혀 없으면 메시지 */}
                                    {availableScreens.length === 0 && (
                                        <div className="text-muted small">
                                            등록된 상영 일정이 없습니다.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 영화 정보 */}
                            <table className="table table-borderless mb-4">
                                <tbody>
                                <tr>
                                    <th className="text-secondary">제목</th>
                                    <td className="fw-semibold">{movie.title}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">감독</th>
                                    <td>{movie.director}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">상영시간</th>
                                    <td>{movie.runningMinutes}분</td>
                                </tr>
                                </tbody>
                            </table>

                            {/* 추가 액션 버튼 */}
                            <div className="d-flex gap-2">


                                <div className="mt-4">
                                    <h5>좌석 선택</h5>
                                    {selectedShowtime ? (
                                        <SeatPicker showtimeId={selectedShowtime.showtimeId}/>
                                    ) : (
                                        <div className="text-muted">회차를 먼저 선택해주세요</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </div>
    );
}

export default HomeMovieDetail;
