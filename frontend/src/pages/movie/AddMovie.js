import {useState, useEffect} from "react";
import {type} from "@testing-library/user-event/dist/type"; //useState는 React가 컴포넌트 안에서 상태를 기억하도록 해주는 Hook. React내부 메모리에 렌더링 되고 사라지지 않게 저장.
import {useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import {useForm} from "react-hook-form";

function AddMovie() {
    // React 훅을 사용하여 상태 변수를 선언
    const {register, handleSubmit, formState: {isSubmitting, errors}} = useForm();
    // const [title, setTitle] = useState(""); //React에서 상태를 선언하는 코드. 비구조화할당 문법. useState()가 반환하는 배열을 title, setTitle로 나눈것.
    // const onChangeTitle = (evt) => setTitle(evt.target.value); //React에서 입력창 <input.이나 <textarea의 값이 바뀔때마다 실행되며 화면에 입력한 내용을 useState에 저장하는 역할.
    // const [director, setDirector] = useState(""); // 현재 상태의 초기값은 "", setDirector는 상태를 바꾸는 함수. useState("")은 초기값을 지정. 여기랑 연동이 돼서. 여기서 친게 React app으로 반영돼
    // const onChangeDirector = (evt) => setDirector(evt.target.value); //onChange... 이벤트 함수 선언, (evt) => 는 onCha...(evt) { }를 줄인것. evt는 이벤트 함수. react에서 이 상황이 발생했을때 한 이벤트를 일어나게 하는데.
    // const [runningMinutes, setRunningMinutes] = useState(""); //title이라는 상태변수를 만들고 그걸 바꾸려면 setTitle을 사용해라. ex: setTitle("너의 이름은")
    // const onChangeRunningMinutes = (evt) => setRunningMinutes(evt.target.value); // 여기선 setTitle,등등의 상태를 바꾸는 것을 evt로 저장한다.
    const [poster, setPoster] = useState(null);
    const onChangePoster = (e) =>{
        const file = e.target.files?.[0];
        if (!file) {
            setPoster(null);
            setPreview("");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 간으합니다");
            e.target.value = "";
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("파일 크기가 10MB를 초과합니다.")
            e.target.value = "";
            return;
        }

        setPoster(file);
        setPreview(URL.createObjectURL(file));
    }
    const [preview, setPreview] = useState("");
    const [result, setResult] = useState("");
    const navigate = useNavigate();




    const addMovie = (fdata) => { //이것도 사실은 원래 addMovie() {  } 이거지. =>이걸 쓰는 이유는 함수 선언과 동시에 값으로써 사용되려고, 호이스팅 되지 않음. + React에서는 이게 간편함.
        console.log('영화 추가입니다')
        console.log('제목: ', fdata.title);
        console.log('감독: ',fdata.director);
        console.log('상영시간: ', fdata.runningMinutes);

        // setResult('제목' + title + '감독' + title + '상영시간' + runningMinutes); //결과값 ""이었던 초기값을 이제 위의것들을 반영해서 제목 title ..의 값으로 설정하겠다.

        const title = fdata.title;
        const director = fdata.director;
        const runningMinutes = fdata.runningMinutes;

        const form = new FormData(); //form을 새로운FormData로 초기화. FormData는 multipart/form-data 형식의 데이터를 손쉽게 만들기 위한 “가상의 폼 데이터 저장소” , html코드에서 <form> </form>
        const data = {title, director, runningMinutes}; //data라는 객체리터럴 생성 ({ }), 안의 값들은 축약된거임. 원래는 title: title ..
        const json = JSON.stringify(data); //json이라는 객체를 생성하는데, 이 json은 data를 JSON.stringify형식으로 바꿔서 저장(즉 Json으로 보겠다) 순수 문자열이라, ""이 생김.
        const blob = new Blob([json], //바이너리 객체 정의. blob은 Blob으로 초기화, 바이너리는 0과 1로만 이루어진 이진수 문법(즉 컴퓨터가 읽게 하겠다), BLob은 바이너리의 집약체
            {type : "application/json"});// 여기선 json의 순수 문자열들을 0,1로 바이너리화 해서 Blob이란 바이너리의 집약체를 blob에 저장하겠다. 타입은 app...이게 json타입. (MIME):어떤 종류의 타입인지 알려줌.
        form.append("movie", blob); //이제 Formdata로 "movie"라는 이름으로 방금만든 blob값을 보내고, 저장. 이제 백엔드와 프론트에서 서로 통할때 movie라는 키로 통해. 즉 controller에서 @Requist movie로 돼 있는지 확인

        if (poster) {
            form.append("poster", poster);
        }

        (async () => {
            await fetcher("http://localhost:8080/api/movie/create", { //fetch는 호출을 DB로 보내는거야. 저 주소에 방식은 POST, 내용은 blob -> 바로 controller에서 POSTMAPPING 돼 있는곳에서내꺼네 하고 처리를 하고, DB에 query로 저장한 후, 201CREATED등의 형식으로 답변을 하면 .then으로 넘어감.)
                method:'post',
                body:form //위에서 form데이터에 blob저장했으면, form 해야지이 하 오 ㅠㅠ
            });
            navigate('/movie'); //그럼 /movie로 이동(movie.js) useNavigate는 react router에서 제공하는 js 페이지 이동 코드.
        }) ();

        // fetcher("http://localhost:8080/api/movie/create", { //fetch는 호출을 DB로 보내는거야. 저 주소에 방식은 POST, 내용은 blob -> 바로 controller에서 POSTMAPPING 돼 있는곳에서내꺼네 하고 처리를 하고, DB에 query로 저장한 후, 201CREATED등의 형식으로 답변을 하면 .then으로 넘어감.
        //     method:'post',
        //     body:form //위에서 form데이터에 blob저장했으면, form 해야지이 하 오 ㅠㅠ
        //     ,credentials: 'include' //쿠키 포함
        // }).then(() => {
        //     navigate('/movie'); //그럼 /movie로 이동(movie.js) useNavigate는 react router에서 제공하는 js 페이지 이동 코드.
        // })
    }

    return (
        <div className="container py-4">
            <form onSubmit={handleSubmit(addMovie)}>
                {/* 헤더 */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h3 m-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-plus"></i> 영화 추가
                    </h1>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate('/movie')}
                    >
                        <i className="fa-solid fa-list-ul me-2"></i>목록
                    </button>
                </div>

                {/* 카드 */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        {/* 간단한 결과/메시지 영역 */}
                        {result && (
                            <div className="alert alert-info" role="alert">
                                {result}
                            </div>
                        )}

                        {/* 폼: 기존 핸들러/상태 그대로 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-file-lines me-2"></i>제목
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
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
                                placeholder="예) 너의 이름은"
                            />
                            {errors && errors.title && (<small role="alert" className="text-danger">{errors.title.message}</small>)}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-solid fa-user-tie me-2"></i>감독
                            </label>
                            <input
                                type="text"
                                name="director"
                                className="form-control"
                                {...register("director", {
                                    required: "감독은 필수 입력입니다.",
                                    min: {
                                        value: 1,
                                        message: "감독은 1자 이상 입력 바랍니다."
                                    },
                                    max: {
                                        value: 50,
                                        message: "감독은 50자 이하 입력 바랍니다."
                                    },
                                })}
                                placeholder="예) 신카이 마코토"
                            />
                            {errors && errors.director && (<small role="alert" className="text-danger">{errors.director.message}</small>)}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-clock me-2"></i>상영시간(분)
                            </label>
                            <input
                                type="number"
                                name="runningMinutes"
                                className="form-control"
                                {...register("runningMinutes", {
                                    required: "상영시간은 필수 입력입니다.",
                                    min: {
                                        value: 1,
                                        message: "상영시간은 1분 이상 입력 바랍니다."
                                    },
                                    max: {
                                        value: 500,
                                        message: "상영시간은 500분 이하 입력 바랍니다."
                                    },
                                })}
                                placeholder="예) 120"
                                min={1}
                            />
                            {errors && errors.runningMinutes && (<small role="alert" className="text-danger">{errors.runningMinutes.message}</small>)}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-image me-2"></i>포스터
                                <span className="text-muted ms-2">(선택, 최대 10MB)</span>
                            </label>
                            <input
                                type="file"
                                name="poster"
                                className="form-control"
                                onChange={onChangePoster}
                                accept="image/*"
                            />
                        </div>

                        {preview && (
                            <div className="mb-3">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="rounded border"
                                    style={{ maxWidth: 240, display: "block", marginTop: 8 }}
                                />
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            <input
                                type="submit"
                                value="영화추가하기"
                                className="btn btn-primary"
                                // onClick={addMovie}
                            />
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/movie')}
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

export default AddMovie;