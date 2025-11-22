import {useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";

function RegisterForm() {
    const {register,
        handleSubmit, reset,
        formState: {errors},
        } = useForm({mode: "onChange"}); //onChange는 입력할때마다 유효성 검사 성능은 좀 떨어짐, onBlur는 포커스 잃을때, onSubmit은 제출할때
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(false);
    const navigate = useNavigate();

    const submitForm = async (data) => {
        setErr(null);
        setOk(false);

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            });

            if (res.status === 409) {
                throw new Error("이미 사용 중인 아이디입니다.");
            }

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `서버오류 (${res.status}`);
            }

            //성공시
            setOk(true);
            reset();

            setTimeout(() => navigate('/login'), 1000);
        } catch (error) {
            console.error(error);
            setErr(error.message);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#0f1220"
            }}
        >
            <form
                onSubmit={handleSubmit(submitForm)}
                style={{
                    background: "rgba(255,255,255,0.08)",
                    padding: "30px 40px",
                    borderRadius: "12px",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
                    color: "#fff",
                    width: "360px"
                }}
            >
                <h3 style={{ textAlign: "center", marginBottom: "20px" }}>회원 가입</h3>

                <div style={{ marginBottom: "14px" }}>
                    <input
                        type="text"
                        placeholder="아이디 (4~10자)"
                        {...register("id", {
                            required: "아이디는 필수입니다",
                            minLength: { //minLength 오타수정 -> min -> minLength 둘의 차이점은 min은 숫자값에 대한 최소값, minLength는 문자열 길이에 대한 최소값
                                value: 4,
                                message: "아이디는 최소 4자 이상이어야 합니다"
                            },
                            maxLength: {
                                value: 10,
                                message: "아이디는 최대 10자 이하여야 합니다"
                            },
                            validate: {
                                asyncOracle: async (value) => {
                                    if (!value) return true;
                                    const r =
                                        await fetch(`http://localhost:8080/api/auth/id-available?id=${encodeURIComponent(value)}`); //아이디 중복체크 encodeURIComponent는 특수문자 처리
                                    if (!r.ok) return "중복확인 실패";
                                    const {available} = await r.json();
                                    return available || "이미 사용 중인 아이디입니다";
                                }
                            }
                        })}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.3)",
                            background: "rgba(255,255,255,0.1)",
                            color: "#fff"
                        }}
                    />
                    {errors.id && (<p style={{ color: "crimson", marginTop: 4 }}>{errors.id.message}</p>)}
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <input
                        type="password"
                        placeholder="비밀번호 (8자 이상)"
                        {...register("pass", {
                            required: "비밀번호는 필수입니다",
                            minLength: {
                                value: 8,
                                message: "비밀번호는 최소 8자 이상이어야 합니다"
                            },
                            maxLength: {
                                value: 20,
                                message: "비밀번호는 최대 20자 이하여야 합니다"
                            }
                        })}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.3)",
                            background: "rgba(255,255,255,0.1)",
                            color: "#fff"
                        }}
                    />
                    {errors.pass && (<p style={{ color: "crimson", marginTop: 4 }}>{errors.pass.message}</p>)}
                </div>

                <div style={{ marginBottom: "18px" }}>
                    <input
                        type="text"
                        placeholder="이름"
                        {...register("name", {
                            required: "이름은 필수입니다",
                            minLength: {
                                value: 2,
                                message: "이름은 최소 2자 이상이어야 합니다"
                            },
                            maxLength: {
                                value: 30,
                                message: "이름은 최대 30자 이하여야 합니다"
                            }
                        })}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.3)",
                            background: "rgba(255,255,255,0.1)",
                            color: "#fff"
                        }}
                    />
                    {errors.name && (<p style={{ color: "crimson", marginTop: 4 }}>{errors.name.message}</p>)}
                </div>

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        background: "linear-gradient(135deg, #4c8dff, #7b5cff)",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontWeight: "bold",
                        cursor: "pointer",
                        boxShadow: "0 6px 14px rgba(92,125,255,0.3)"
                    }}
                >
                    가입
                </button>

                {ok && (
                    <p style={{ color: "lightgreen", textAlign: "center", marginTop: 14 }}>
                        가입 완료! 로그인 페이지로 이동합니다...
                    </p>
                )}
                {err && (
                    <p style={{ color: "crimson", textAlign: "center", marginTop: 14 }}>
                        오류: {err}
                    </p>
                )}
            </form>
        </div>
    );
}

export default RegisterForm;