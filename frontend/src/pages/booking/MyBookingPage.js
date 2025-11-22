import {useState, useEffect, useMemo} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {fetcher} from "../../lib/fetcher";
import useMe from "../../hooks/useMe";

function MyBookingPage() {
    const user = useMe();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [cancelTarget, setCancelTarget] = useState(null); // ✅ 취소 패널용 상태


    const grouped = useMemo(() => {
        const map = {};

        bookings.forEach(b => {
            const key = `${b.movieTitle}-${b.screenName}-${b.startedAt}-${b.status}`;

            if (!map[key]) {
                map[key] = {
                    ...b,
                    seats: []
                };
            }
            map[key].seats.push(b.seatLabel);
        });

        return Object.values(map);
    }, [bookings]);


    useEffect(() => {
        (async () => {
            try {
                const data = await fetcher("http://localhost:8080/api/my/bookings");
                setBookings(data);
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const load = async () => {

        const data = await fetcher('http://localhost:8080/api/my/bookings');

        setBookings(data ?? []);

    }

    const cancleBooking = async (bookingId, seatId) => {
        //예매 취소 API 호출
        try {
            if (window.confirm(` ${seatId}번 좌석의 예매를 취소하시겠습니까?`)) {
                await fetcher(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                    method: "POST"
                });
                alert("예매가 취소되었습니다.");
                await load();
            }
        } catch {
            alert("예매 취소에 실패했습니다.");
        }
    }

    if (loading) return <div className="container py-4">로딩중...</div>
    if (error) return <div className="container py-4 text-danger">에러 발생: {error}</div>

    // ✅ 카드에서 호출: 패널 열기만 함
    const openCancelPanel = (group) => {
        if (group.status !== "CONFIRMED") return;
        setCancelTarget({
            seats: group.seats
        });
    };
    const handleConfirmCancel = async () => { // ✅ 패널에서 호출: 실제 취소 처리
        if (!cancelTarget) return;
        const seatText = cancelTarget.seats.join(", ");
        await cancleBooking(cancelTarget.bookingId, seatText);
    };

    return (
        <div className="container py-4">
            {cancelTarget && (
                <div
                    style={{
                        position: "fixed",
                        top: "16px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 1050,
                        minWidth: "320px",
                        maxWidth: "600px",
                        backgroundColor: "#222",
                        borderRadius: "12px",
                        border: "1px solid #444",
                        padding: "16px 20px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                        color: "white",
                        transition: "all 0.25s ease-out",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <div style={{fontSize: "0.85rem", opacity: 0.8}}>예매 취소 확인</div>
                            <div style={{fontWeight: 700, fontSize: "1.05rem"}}>
                                {cancelTarget.movieTitle}
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-light"
                            onClick={() => setCancelTarget(null)}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{fontSize: "0.9rem", marginBottom: "10px"}}>
                        💺 취소될 좌석:{" "}
                        <span style={{fontWeight: 600}}>
                            {cancelTarget.seats.join(", ")}
                        </span>
                    </div>

                    <div className="d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => setCancelTarget(null)}
                        >
                            닫기
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={handleConfirmCancel}
                        >
                            전체 예매 취소
                        </button>
                    </div>
                </div>
            )}
            {/* 메인으로 가기 버튼 */}
            <button
                onClick={() => navigate("/")}
                className="btn btn-outline-light mb-4"
                style={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontWeight: 600,
                    backgroundColor: "#222",
                    border: "1px solid #444",
                }}
            >
                ← 메인으로 돌아가기
            </button>
            <div className="row g-4">
                {grouped.map((b, id) => (
                    <div key={id} className="col-12 col-md-6 col-lg-4">
                        <div
                            className="card h-100"
                            style={{
                                backgroundColor: "#1c1c1c",
                                border: "1px solid #333",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}
                        >
                            <img
                                src={`http://localhost:8080/${b.posterUrl}`}
                                className="card-img-top"
                                alt="poster"
                                style={{
                                    height: "360px",
                                    objectFit: "cover"
                                }}
                            />

                            <div className="card-body" style={{ color: "white" }}>
                                <h5
                                    className="card-title mb-3"
                                    style={{
                                        fontWeight: 700,
                                        fontSize: "1.2rem"
                                    }}
                                >
                                    {b.movieTitle}
                                </h5>

                                <p className="card-text mb-1">🎬 상영관: {b.screenName}</p>
                                <p className="card-text mb-1">
                                    💺 좌석: {b.seats.join(", ")}</p>
                                <p className="card-text mb-1">⏰ 시작시간: {b.startsAt.replace("T", ": ")}</p>
                                <p className="card-text mb-1">
                                    📅 예매일: {b.bookedAt.replace("T", ": ").split(".")[0]}
                                </p>
                                <p className="card-text">
                                    상태:
                                    <span
                                        style={{
                                            marginLeft: 6,
                                            padding: "2px 8px",
                                            borderRadius: "6px",
                                            backgroundColor:
                                                b.status === "CONFIRMED" ? "#28a745" : "#dc3545",
                                            color: "white",
                                            fontWeight: 600,
                                            fontSize: "0.85rem"
                                        }}
                                    >
                                    {b.status}
                                </span>
                                </p>
                                <button
                                    type="button"
                                    className="btn btn-outline-danger mt-3"
                                    onClick={() => openCancelPanel(b)} // ✅ 패널 열기
                                    disabled={b.status !== "CONFIRMED"}
                                >
                                    예매 취소
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );

}
export default MyBookingPage;