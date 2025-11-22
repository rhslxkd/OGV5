import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import { useForm } from "react-hook-form";

function MovieEdit() {
    const { id: mid } = useParams();
    const navigate = useNavigate();

    // 포스터 파일/미리보기
    const [poster, setPoster] = useState(null);
    const [preview, setPreview] = useState("");
    const [movie, setMovie] = useState([]);

    // 폼: 기본값 설정 후 reset으로 서버 값 주입
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
        reset,
    } = useForm({
        defaultValues: {
            title: "",
            director: "",
            runningMinutes: "",
        },
    });

    // 상세 로딩 -> reset으로 주입, 서버 포스터 미리보기 세팅
    useEffect(() => {
        (async () => {
            const data = await fetcher(`http://localhost:8080/api/movie/${mid}`);
            if (!data) return;

            reset({
                title: data.title ?? "",
                director: data.director ?? "",
                runningMinutes: data.runningMinutes ?? "",
            });

            // 캐시 무효화를 위해 쿼리스트링 추가
            setPreview(`http://localhost:8080/api/movie/${mid}/poster?ts=${Date.now()}`);
        })();
    }, [mid, reset]);

    // 새 포스터 선택 핸들러
    const onChangePoster = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPoster(null);
            // 기존 서버 포스터로 복원
            setPreview(`http://localhost:8080/api/movie/${mid}/poster?ts=${Date.now()}`);
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            e.target.value = "";
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("파일 크기가 10MB를 초과합니다.");
            e.target.value = "";
            return;
        }

        setPoster(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
    };

    // 수정 제출
    const updateMovie = async (fdata) => {
        const title = fdata.title;
        const director = fdata.director;
        const runningMinutes = Number(fdata.runningMinutes);

        const form = new FormData();
        const json = JSON.stringify({ title, director, runningMinutes });
        form.append("movie", new Blob([json], { type: "application/json" }));
        if (poster) form.append("poster", poster);

        await fetcher(`http://localhost:8080/api/movie/${mid}`, {
            method: "PUT",
            body: form,
        });
        navigate("/movie");
    };

    return (
        <div className="container py-4">
            <form onSubmit={handleSubmit(updateMovie)}>
                {/* 헤더 */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <h1 className="h4 m-0 d-flex align-items-center gap-2">
                        <i className="fa-solid fa-pen-to-square"></i> 영화 수정
                    </h1>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate("/movie")}
                    >
                        <i className="fa-solid fa-list-ul me-2"></i>목록
                    </button>
                </div>

                {/* 카드 */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        {/* 제목 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-file-lines me-2"></i>제목
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="예) 인셉션"
                                {...register("title", { required: "제목은 필수 입력입니다." })}
                            />
                            {errors.title && <small role="alert">{errors.title.message}</small>}
                        </div>

                        {/* 감독 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-solid fa-user-tie me-2"></i>감독
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="예) 크리스토퍼 놀란"
                                {...register("director", { required: "감독은 필수 입력입니다." })}
                            />
                            {errors.director && <small role="alert">{errors.director.message}</small>}
                        </div>

                        {/* 상영시간 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-clock me-2"></i>상영시간(분)
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="예) 148"
                                min={1}
                                {...register("runningMinutes", {
                                    required: "상영시간은 필수 입력입니다.",
                                    valueAsNumber: true,
                                    min: { value: 1, message: "1분 이상이어야 합니다." },
                                })}
                            />
                            {errors.runningMinutes && (
                                <small role="alert">{errors.runningMinutes.message}</small>
                            )}
                        </div>

                        {/* 포스터 업로드 */}
                        <div className="mb-3">
                            <label className="form-label fw-semibold">
                                <i className="fa-regular fa-image me-2"></i>포스터 변경
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={onChangePoster}
                                accept="image/*"
                            />

                        </div>

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

                        {/* 액션 */}
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                수정하기
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/movie")}
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

export default MovieEdit;