import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import Pagination from "../../components/Pagination";
import {fetcher} from "../../lib/fetcher";
import {useNavigate} from "react-router-dom";

function Board() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const [board, setBoard] = useState([]);

    // 현재 세션 사용자 정보
    const [user] = useState(() => {
        const u = sessionStorage.getItem("user");
        return u ? JSON.parse(u) : null;
    });

    //기본적으로 최초 1회.
    useEffect(() => {
        (async () => {
            console.log("게시판 입니당")
            const data = await fetcher(`http://localhost:8080/api/board/main?page=${page - 1}`);
            if (!data) return;
            setBoard(data.contents);
            setTotalPages(data.totalPages);
        })();
    }, [page]);

    return (
        <div className="container py-4">
            {/* 헤더 영역 */}
            <div className="d-flex align-items-center justify-content-between mb-3">
                <h1 className="h4 m-0 d-flex align-items-center gap-2">
                    <i className="fa-regular fa-clipboard"></i> 게시판
                </h1>
                <div className="btn-group" role="group" aria-label="actions">
                    <Link to="/addBoard" className="btn btn-primary">
                        <i className="fa-solid fa-plus me-2"></i>글쓰기
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                        <i className="fa-solid fa-file-import me-2"></i>메인으로
                    </Link>
                </div>

            </div>

            {/* 리스트 카드 */}
            <div className="card shadow-sm">
                <div className="card-body">
                    {/* 빈 상태 */}
                    {board && board.length === 0 && (
                        <div className="text-muted py-5 text-center">
                            <i className="fa-regular fa-face-meh-blank me-2"></i>
                            등록된 게시글이 없습니다.
                        </div>
                    )}

                    {/* 테이블 */}
                    {board && board.length > 0 && (
                        <div className="table-responsive">
                            <table className="table table-hover table-striped align-middle mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th style={{ width: 100 }}>글번호</th>
                                    <th>제목</th>
                                    <th style={{ width: 160 }}>글쓴이</th>
                                    <th style={{ width: 180 }}>작성날짜</th>
                                    <th style={{ width: 120 }} className="text-end">조회수</th>
                                    <th style={{ width: 120 }}>액션</th>
                                </tr>
                                </thead>
                                <tbody>
                                {board.map((b) => (
                                    <tr key={b.num}>
                                        <td className="text-muted">{b.num}</td>
                                        <td>
                                            <Link to={`/board/${b.num}`} className="text-decoration-none">
                                                <i className="fa-regular fa-file-lines me-2"></i>
                                                <span className="fw-semibold">{b.title}</span>
                                            </Link>
                                        </td>
                                        <td>
                                            <i className="fa-regular fa-user me-2 text-secondary"></i>
                                            {b.id}
                                        </td>
                                        <td>{b.postdate?.replace('T', ' ')}</td>
                                        <td className="text-end">
                      <span className="badge bg-secondary-subtle text-dark">
                        <i className="fa-regular fa-eye me-1"></i>
                          {b.visitcount}
                      </span>
                                        </td>
                                        <td>
                                            {/* 수정 버튼: 관리자면 항상, 아니면 본인 글일 때만 보이도록 */}
                                            {(user?.role === "ROLE_ADMIN" || user?.id === b.id) && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outer-danger"
                                                    onClick={() => {
                                                        if (window.confirm("정말 삭제하시겠어요?")) {
                                                            (async () => {
                                                                await fetcher(`http://localhost:8080/api/board/${b.num}`, {
                                                                    method: 'DELETE'
                                                                });
                                                                // 삭제 후 게시판 목록 새로고침
                                                                const data = await fetcher(`http://localhost:8080/api/board/main?page=${page - 1}`);
                                                                if (!data) return;
                                                                setBoard(data.contents);
                                                                setTotalPages(data.totalPages);
                                                            })();
                                                        }
                                                    }}
                                                >
                                                    <i className="fa-solid fa-trash-can me-2"></i>삭제
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 페이지네이션 */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center pt-3">
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                around={5}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}
export default Board;