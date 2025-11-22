import {useForm} from "react-hook-form";
import {useState} from "react";
import {data, useNavigate, useLocation} from "react-router-dom";
import Home from "../home/Home";

function LoginForm() {

    const {register, handleSubmit, formState: {errors}} = useForm()
    const [result, setResult] = useState(null);
    const navigate = useNavigate();
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    //원래 가려고 했던 주소
    const from = location.state?.from?.pathname || "/";

    const submitForm = async (data) => {
        console.log(data);
        setErr("");
        setLoading(false);

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', { //await은 then 대신
                method:"POST",
                headers: {"Content-Type": "application/json"},
                credentials:"include", //이게 있어야 인증이 됨.
                body: JSON.stringify(data)
            });

            //실패처리
            if (!res.ok) {
                let msg = "로그인에 실패했습니다";
                setErr(msg);
                return;
            }

            //성공
            const user = await res.json();
            if (user) sessionStorage.setItem("user", JSON.stringify(user));

            navigate(from, {replace: true});
        } catch (e) {
            setErr("네트워크 오류 발생");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",       // 전체 화면 높이
                background: "#0f1220"  // 어두운 배경
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
                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>로그인</h2>

                <label htmlFor="id">아이디:</label>
                <input
                    id="id"
                    type="text"
                    autoComplete="off"
                    {...register("id", {
                        required: "아이디를 입력해주세요.",
                        minLength: {
                            value: 4,
                            message: "아이디는 최소 4자 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 10,
                            message: "아이디는 최대 10자 이하여야 합니다."
                        }
                    })}
                    placeholder="sora"
                    style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
                />
                {errors.id && (<p style={{ color: "crimson", marginTop: 4 }}>{errors.id.message}</p>)}

                <label htmlFor="pass">비밀번호:</label>
                <input
                    id="pass"
                    type="password"
                    autoComplete="off"
                    {...register("pass", {
                        required: "비밀번호를 입력해주세요.",
                        minLength: {
                            value: 4,
                            message: "비밀번호는 최소 6자 이상이어야 합니다."
                        },
                        maxLength: {
                            value: 20,
                            message: "비밀번호는 최대 20자 이하여야 합니다."
                        }
                    })}
                    placeholder="********"
                    style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
                />
                {errors.pass && (<p style={{ color: "crimson", marginTop: 4 }}>{errors.pass.message}</p>)}

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "10px",
                        background: "#4c8dff",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>

                {err && (
                    <p style={{ color: "crimson", textAlign: "center" }}>{err}</p>
                )}

                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    // 또다른 방법 (링크) : <Link to="/register">회원가입</Link> 완성하면 -> onClick 필요없음 왜? 링크가 알아서 이동해주니까 그럼 나 onClick={() => navigate("/register")}이거 빼고 <Link to="/register">회원가입</Link> 이렇게 바꾸기 이럼 된다고? ㅇㅇ
                    style={{
                        display: "block",
                        margin: "10px auto 0",
                        background: "none",
                        color: "#ccc",
                        border: "none",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
            }

            export default LoginForm;