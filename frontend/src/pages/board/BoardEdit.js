import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";


function BoardEdit() {

    const {register, handleSubmit, formState: {isSubmitting, errors},
        setValue, reset} = useForm();

    let params = useParams();  //let대신 const도 됨(변하지 않아)
    const navigate = useNavigate();
    const bid = params?.id; //?는 값이 없으면 null, 값이 있으면 id가 들어감.(id를 가져와)
    const [board, setBoard]  = useState(null);
    const userNavigate = useNavigate();

    const user = useMe();

    useEffect(() => {
        (async() =>{
            const data = await fetcher(`http://localhost:8080/api/board/${bid}`);
            if (!data) return;
            // setBoard(data); reset으로 대체
            reset({
                title: data.title ?? "",
                content: data.content ?? "",
            })
        } )();
        // fetch(`http://localhost:8080/api/board/${bid}`)
        //     .then((res) => res.json())
        //     .then((data) => {
        //         console.log(data)
        //         setBoard(data)
        //     })
    }, [bid, reset]); //처음 로그가 되면 실행되는 부분

    useEffect(() => {
        if (board != null) {
            // setTitle(board.title);
            // setContent(board.content); 대신에
            setValue("title", board.title); //react-hook-form에서 제공하는 함수
            setValue("content", board.content);
        }
    }, [board])

    // const [title, setTitle] =useState("");
    // const [content, setContent] =useState("");
    //
    // const onChangeTitle = (evt) => setTitle(evt.target.value);
    // const onChangeContent = (evt) => setContent(evt.target.value);
    //
    // const [result, setResult] = useState("");


    const updateBoard = (fdata) => {
        console.log('애디트보듭다');
        console.log(fdata); //실제 서비스에서는 여기다가 API호출하는 부분이 들어감. + 안슴 이거
        // console.log('제목:', title);
        // console.log('내용:', content);
        // //처리
        // setResult('제목' + title + ", 내용:" + content);

        const title = fdata.title;
        const content = fdata.content;

        // form.append('title', title);
        // form.append('content', content);
        const form = new FormData();
        const id = user?.id;
        const data = {title, content, id};
        const json = JSON.stringify(data);
        const blob = new Blob([json],
            {type: "application/json"});
        form.append("board", blob);

        (async () => {
            await fetcher(`http://localhost:8080/api/board/${bid}`, {
                method:'PUT',
                body: form
            })
            navigate('/board');
        })();

        // fetch(`http://localhost:8080/api/board/${bid}`, {
        //     method: 'put',
        //     credentials: 'include',
        //     body: 'form',
        // }).then(() => {
        //     navigate('/board');
        // })

    }

    return (
        <div className="container py-4">
            <form onSubmit={handleSubmit(updateBoard)}>
                {/* 헤더 */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h4 m-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-pen-to-square"></i> 게시글 수정
                    </h1>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => userNavigate('/board')}
                    >
                        <i className="fa-solid fa-list-ul me-2"></i>목록
                    </button>
                </div>

                {/* 카드 영역 */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        {/*/!* 수정 결과 메시지 *!/*/}
                        {/*{result && (*/}
                        {/*    <div className="alert alert-info d-flex align-items-center" role="alert">*/}
                        {/*        <i className="fa-solid fa-circle-info me-2"></i>*/}
                        {/*        <div>{result}</div>*/}
                        {/*    </div>*/}
                        {/*)}*/}

                        {/* 제목 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-file-lines me-2"></i>제목
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="수정할 제목을 입력하세요"
                                {...register ("title", {required: "제목은 필수 입력입니다."})}
                            />
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
                                placeholder="수정할 내용을 입력하세요"
                                {...register ("content", {required: "내용은 필수 입력입니다."})}
                            ></textarea>
                        </div>

                        {/* 버튼 */}
                        <div className="d-flex gap-2">
                            <input
                                type="submit"
                                value="수정"
                                className="btn btn-primary"
                                // onClick={updateBoard}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => userNavigate('/board')}
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

export default BoardEdit;