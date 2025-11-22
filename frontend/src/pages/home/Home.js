import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState, useMemo} from "react";
import useMe from "../../hooks/useMe";
import {fetcher} from "../../lib/fetcher";

function Home() {
    const user = useMe();

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        //즉시함수
        (async () => { //async 붙여야 await 사용 가능
            try { // 에러처리 try catch finally 구문
                const data = await fetcher('http://localhost:8080/api/home/now'); // await은 비동기 처리 완료까지 기다림
                setItems(data); // 데이터 설정
            }catch (e) { // 에러 발생 시 처리
                setError(e.message); // 에러 메시지 설정
            }finally { // 항상 실행되는 부분
                setLoading(false); // 로딩 상태 해제
            }
        })();

    }, []);


    if (loading) return <div className="container py-4">로딩중...</div>
    if (error) return <div className="container py-4 text-danger">에러 발생: {error}</div>

    const S = {
        container: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            padding : 24,
            background: "#0f1220",
            color: "#fff"
        },
        sidebar: {
            width: 220,
            padding: 16,
            borderRight: "1px solid rgba(255,255,255,0.1)"
        },
        layoutRow: {
            display: "flex",
            flexDirection: "row",
            gap: 32,
            alignItems: "flex-start"
        },
        cardsWrap: {
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            padding: 8
        },
        // ▶ 콘텐츠 영역: 세로 플렉스 (헤더 위, 카드 아래)
        content: {
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minWidth: 0,
        },

        // ▶ 헤더 스타일
        header: {
            padding: "8px 4px",
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.4,
            borderBottom: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 4,
        },
        card: {
            width: 180,
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
            transition: "transform .2s, box-shadow .2s"
        },
        cardHover: {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.5)"
        },
        posterBox: {
            position: "relative",
            width: "100%",
            paddingTop: "150%", // 2:3 비율
            overflow: "hidden"
        },
        posterImg: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover"
        },
        cardBody: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: "12px 14px",
            fontSize: 14
        },
        title: {
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.3,
            margin: 0
        },
        meta: {
            fontSize: 12,
            opacity: .8,
            margin: 0
        },
        btn: {
            marginTop: "auto",
            width: "100%",
            fontSize: 13
        },
        menuBtn: {
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "8px 12px",
            marginBottom: 8,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#cbd5e1",
            borderRadius: 8,
            cursor: "pointer"
        },
    };

    return (
        <div style={S.container}>
            <main style={S.layoutRow}>
                <aside style={S.sidebar}>
                    <button style={S.menuBtn} onClick={() => navigate("/movie")}>영화목록</button>
                    <button style={S.menuBtn} onClick={() => navigate("/board")}>게시판</button>
                </aside>
                <section style={S.content}>
                    <h1 style={S.header}>현재 상영중인 영화를 확인하고 예매해보세요!</h1>

                    <div style={S.cardsWrap}>
                        {items.map((m) => (
                            <div className="card" style={S.card}>
                                <img src={`http://localhost:8080/${m.posterUrl}`} className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title" style={{ color: "white" }}>
                                        제목: {m.title}
                                    </h5>
                                    <p className="card-text" style={{ color: "white" }}>
                                        감독: {m.director}
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-secondary ms-auto"
                                        onClick={() => navigate(`/movies/${m.movie_id}`)}
                                    >
                                        <i className="fa-solid fa-plus me-2"></i>상세보기
                                    </button>
                                </div>
                            </div>
                        ))}
                        {user?.role === "ROLE_ADMIN" && (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => navigate(`/`)}>
                                <i className="fa-solid fa-ticket-simple me-2"></i>추가하기.
                            </button>
                        )}
                    </div>
                </section>
            </main>

        </div>
    );
}

export default Home;