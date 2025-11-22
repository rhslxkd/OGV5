import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useMe} from "../hooks/useMe";
import myBookingPage from "../pages/booking/MyBookingPage";

function Header() {

    const user = useMe();

    const [loading, setLoading] = useState(!user);
    const navigate = useNavigate();

    const onLogout = async () => {
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST", credentials: "include"
        });
        sessionStorage.removeItem("user");
        navigate("/login", {replace: true});
    };

    const roleLabel = (user?.role ?? "").replace(/^ROLE_/, ""); // ROLE_ 접두사 제거

    const S = {
        topbar: {
            display: "flex",
            background: "#1b2143",
            color: "white",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
        },
        brand: { fontWeight: 700 },
        actions: { display: "flex", alignItems: "center", gap: 12 },
        main: { flex: 1, padding: 16 },
        button: {
            padding: "6px 10px",
            borderRadius: 8,
            background: "#4c8dff",
            border: "none",
            color: "#fff",
            cursor: "pointer"
        }
    };
  return (
    <header style={S.topbar}>
        <div style={S.brand}>OGV :: 당신만의 영화관</div>
        <div style={S.actions}>
            {user && <span>안녕하세요, {user.name}({user.id}) {roleLabel}</span>}
            {user?.role === "ROLE_ADMIN" && (
                <a href="/movie"
                   style={{textDecoration: "none"}}>관리자 대시보드</a>
            )}
            <button style={S.button} onClick={() => navigate("/mypage/bookings")}>내 예약현황</button>
            <button style={S.button} onClick={onLogout}>로그아웃</button>
        </div>
    </header>
  );
}
export default Header;