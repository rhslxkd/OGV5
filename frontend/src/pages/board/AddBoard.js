import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import {useForm} from "react-hook-form";
import "../../assets/css/board.css"
import useMe from "../../hooks/useMe";

function AddBoard() {
    const navigate = useNavigate();

    //react-hook-form으로인해 사용을 안함.
    // const [title, setTitle] =useState("");
    // const [content, setContent] =useState("");
    //
    // const onChangeTitle = (evt) => setTitle(evt.target.value);
    // const onChangeContent = (evt) => setContent(evt.target.value);
    //
    // const [result, setResult] = useState("");

    const user = useMe();

    //react-hook-form 사용 준비
    const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm();


    const addBoard = (fdata) => {
        console.log('애드보듭다');
        console.log('제목:', fdata.title);
        console.log('내용:', fdata.content);

        const title = fdata.title;
        const content = fdata.content;
        //처리

        const form = new FormData();
        // form.append('title', title);
        // form.append('content', content);
        const id = user?.id;
        const data = {title, content, id};
        const json = JSON.stringify(data);
        const blob = new Blob([json],
            {type: "application/json"});
        form.append("board", blob);

        (async () => {
            await fetcher("http://localhost:8080/api/board/create", {
                method: 'post',
                body: form
            })
            navigate('/board');
        })();

        // fetcher("http://localhost:8080/api/board/create", {
        //     method: 'post',
        //     body: form,
        //     credentials: 'include',
        // }).then(() => {
        //     navigate('/board');
        // })
    }

    return (
        <div className="container py-4">
            <form onSubmit={handleSubmit(addBoard)}>
                {/* 헤더 */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h4 m-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-pen"></i> 게시글 작성
                    </h1>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/board')}
                    >
                        <i className="fa-solid fa-list-ul me-2"></i>목록
                    </button>
                </div>

                {/* 카드 레이아웃 */}
                <div className="card shadow-sm">
                    <div className="card-body">

                        {/* 제목 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-file-lines me-2"></i>제목
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="제목을 입력하세요"
                                {...register("title", {
                                    required: "제목은 필수 입력입니다.",
                                    min: {
                                        value: 1,
                                        message: "제목은 1자 이상 입력 바랍니다."
                                    },
                                    max: {
                                        value: 100,
                                        message: "제목은 100자 이하 입력 바랍니다."
                                    },
                                })}
                            />
                            {errors.title && <small role="alert" className="text-danger">{errors.title.message}</small>}
                        </div>

                        {/* 내용 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-pen-to-square me-2"></i>내용
                            </label>
                            <textarea
                                name="content"
                                rows="6"
                                className="form-control"
                                placeholder="내용을 입력하세요"
                                {...register("content", {
                                    required: "내용은 필수 입력입니다.",
                                    min: {
                                        value: 1,
                                        message: "내용은 1자 이상 입력 바랍니다."
                                    },
                                    max: {
                                        value: 1000,
                                        message: "내용은 1000자 이하 입력 바랍니다."
                                    }})}
                            ></textarea>
                            {errors.content && <small role="alert">{errors.content.message}</small>}
                        </div>

                        {/* 버튼 */}
                        <div className="d-flex gap-2">
                            <input
                                type="submit" //react-hook-form 사용시 반드시 submit이어야함.
                                value="글쓰기"
                                className="btn btn-primary"
                                // onClick={addBoard}이걸 제거해야 경유함(handlerSubmit과 충돌)
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/board')}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );

}

export default AddBoard;