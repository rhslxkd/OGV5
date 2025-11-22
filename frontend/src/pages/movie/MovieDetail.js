import {useState, useEffect} from "react"; //useState는 상태 기억, useEffect는 값이 변하면 다시 실행시킴.
import {useParams, useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";// Navigation은 주소를 옮김. return redirect랑 비슷, useParams는 url에 있는 변수를 꺼내옴, 여기 detail에서 젤 중여한거지.
import useMe from "../../hooks/useMe";

function MovieDetail() {
    const navigate = useNavigate();
    let params = useParams();
    const mid = params?.id; // mid라는거는, 주소에 있는 id를 가져오는것?
    const [movie, setMovie] = useState([]);

    const user = useMe();

    useEffect(() => { //비동기면 안됨.
        (async () => { //즉시 실행 함수
            const data = await fetcher(`http://localhost:8080/api/movie/${mid}`); //Controller의 GetMapping("/{id}")와 연결됨.
            if (!data) return; //데이터가 없으면 리턴
            setMovie(data); //여긴 이제 useState로 받음 movie를 이제 data값을 가져와서 입힘. {movie.title}이라는 명령이 가능해짐.
        })(); //즉시 실행 함수, 이거 안하면 async함수를 useEffect에 바로 못넣음.
        // fetcher(`http://localhost:8080/api/movie/${mid}`, {
        //     credentials: "include",
        // }) //Controller의 GetMapping("/{id}")와 연결됨.
        //     .then((res) => res.json()) //오케이 위에서 fetch로 요청을 보내고 응답을 기다리는동안, 미리 promise객체로 이렇게 하겠다라고 설정하는과정. 여기서res는 response객체로 헤더, 본문 내용을 다 가지고 있는데,요청이 오는중에 body를 못읽는상황이면 저 .json을 불러서 body를 읽는거임.
        //     .then((data) => {
        //         console.log(data) //이제 DB에서 값들을 data로 가져와서 console에 data를 json형식으로 띄어줌.
        //         setMovie(data) //여긴 이제 useState로 받음 movie를 이제 data값을 가져와서 입힘. {movie.title}이라는 명령이 가능해짐.
        //     });
    }, []); //[]는 의존성 배열(의존성 배열은 react가 이걸 읽을때 언제 실행할지 (fetch)를 알려줌)인데, 비어있음 -> 처음에 한번만 실행.왜냐면 뭐 조건이 없네? 한번만 해야지,생략하면 무한루프, count이런게 나오면 count가 변할떄마다 실행



    return (
        <div className="container py-4">
            {movie && ( // movie가 있을때만 렌더링 이걸 해야하는 이유는 useEffect가 비동기라서 처음에 movie가 비어있을수도 있어서 에러날수도있음.
                <>
                    {/* 헤더 */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h1 className="h4 m-0 d-flex align-items-center gap-2">
                            <i className="fa-solid fa-film"></i> 영화 상세
                        </h1>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(`/movie`)}
                        >
                            <i className="fa-solid fa-list-ul me-2"></i>목록
                        </button>
                    </div>

                    {/* 카드 형태로 내용 표시 */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body">

                            {/* 포스터 이미지 */}
                            {movie.posterUrl && (
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://localhost:8080/${movie.posterUrl}`}
                                        alt="poster"
                                        className="rounded shadow-sm"
                                        style={{ maxWidth: 320 }}
                                    />
                                </div>
                            )}

                            {/* 영화 정보 */}
                            <table className="table table-borderless mb-4">
                                <tbody>
                                <tr>
                                    <th style={{ width: 120 }} className="text-secondary">
                                        영화 ID
                                    </th>
                                    <td>{movie.movie_id}</td>
                                </tr>
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

                            {/* 버튼 구역 */}
                            <div className="d-flex gap-2">
                                {user?.role === "ROLE_ADMIN" && (
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/movieEdit/${movie.movie_id}`)}
                                    >
                                        <i className="fa-solid fa-pen-to-square me-2"></i>수정
                                    </button>
                                )}
                                {user?.role === "ROLE_ADMIN" && (
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (window.confirm("정말 삭제하시겠어요?")) {
                                                fetch(`http://localhost:8080/api/movie/${movie.movie_id}`, {
                                                    method: "delete", credentials : "include"
                                                }).then(() => navigate("/movie"));
                                            }
                                        }}
                                    >
                                        <i className="fa-solid fa-trash-can me-2"></i>삭제
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-auto"
                                    onClick={() => navigate(`/movie`)}
                                >
                                    <i className="fa-solid fa-arrow-left me-2"></i>목록으로
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}

export default MovieDetail;