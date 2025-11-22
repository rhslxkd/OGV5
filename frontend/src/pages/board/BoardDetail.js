import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {computeHeadingLevel} from "@testing-library/dom";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";

function BoardDetail() {

    let params = useParams();  //let대신 const도 됨(변하지 않아)
    const userNavigate = useNavigate();
    const [visitCount, setVisitCount] = useState(null);
    const bid = params?.id; //?는 값이 없으면 null, 값이 있으면 id가 들어감.(id를 가져와)
    const [board, setBoard]  = useState(null);

    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/board/${bid}`);
            if (!data) return;
            setBoard(data);
        })();
        // fetch(`http://localhost:8080/api/board/${bid}`, {
        //     credentials: "include"
        // })
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data)
        //         setBoard(data)
        //     });
    }, []); //처음 로그가 되면 실행되는 부분

    useEffect(() => {
        (async () => {
            if (board == null) return;
            const data = await fetcher(`http://localhost:8080/api/board/${bid}/counts`, {
                method: 'POST',
            });
            setVisitCount(data.visitCount);
        })();
        // if (board != null) {
        //     fetch(`http://localhost:8080/api/board/${bid}/counts`, {
        //         method:'POST', credentials: 'include'
        //     })
        //         .then((res) => res.json())
        //         .then((data) => setVisitCount(data.visitCount))
        // }
    }, [bid, board])

    const user = useMe();

    // 글쓴이 식별
    const isAdmin = user?.role === "ROLE_ADMIN";
    const isOwner = user?.id && board?.id && user.id === board.id; //and 연산자
    const canEditDelete = isAdmin || isOwner; //or 연산자

    return (
        <div className="container py-4">
            {board && (
                <>
                    {/* 헤더 */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h1 className="h4 m-0 d-flex align-items-center gap-2">
                            <i className="fa-regular fa-file-lines"></i> 디테일입니다.
                        </h1>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => userNavigate('/board')}
                        >
                            <i className="fa-solid fa-list-ul me-2"></i>목록
                        </button>
                    </div>

                    {/* 카드 레이아웃 */}
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <p className="text-muted mb-1">{bid}번 게시물입니다.</p>

                            <table className="table table-borderless mb-4">
                                <tbody>
                                <tr>
                                    <th style={{ width: 120 }} className="text-secondary">
                                        제목
                                    </th>
                                    <td className="fw-semibold">{board.title}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">내용</th>
                                    <td style={{ whiteSpace: "pre-line" }}>{board.content}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">글쓴이</th>
                                    <td>{board.id}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">작성날짜</th>
                                    <td>{board.postdate?.replace('T', ' ')}</td>
                                </tr>
                                <tr>
                                    <th className="text-secondary">조회수</th>
                                    <td>{board.visitcount}</td>
                                </tr>
                                </tbody>
                            </table>

                            {canEditDelete && <>
                                {/* 버튼 영역 */}
                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => userNavigate(`/boardEdit/${board.num}`)}
                                    >
                                        <i className="fa-solid fa-pen-to-square me-2"></i>수정
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            if (window.confirm("정말 삭제하시겠어요?")) {
                                                fetch(`http://localhost:8080/api/board/${board.num}`, {
                                                    method: "delete", credentials: "include"
                                                }).then(() => userNavigate("/board"));
                                            }
                                        }}
                                    >
                                        <i className="fa-solid fa-trash-can me-2"></i>삭제
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-auto"
                                        onClick={() => userNavigate('/board')}
                                    >
                                        <i className="fa-solid fa-arrow-left me-2"></i>목록으로
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

}
export default BoardDetail;