import {useState, useEffect, useMemo} from "react";
import {fetcher} from "../lib/fetcher";

export default function SeatPicker({ showtimeId }) {

    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reload = async () => {
        const data=
            await fetcher(`http://localhost:8080/api/showtimes/${showtimeId}/seats`);
            //console.log(data);
            setSeats((data ?? []));

    }

    const [annyung, setAnnyung] = useState("안녕");
    const book = async (seat) => {
        if (seat.userTaken) {
            //이미 내가 예매한 좌석이면 취소 처리
            await cancleBooking(seat.bookingIdForUser, seat.seatId);
        } else if (!seat.taken) {
            //빈 좌석이면 예매 처리
            await bookSeat(seat.seatId);
        } else {
            alert("이미 예매된 좌석입니다.");
        }
    }
    const cancleBooking = async (bookingId, seatId) => {
        //예매 취소 API 호출
        try {
            if (window.confirm(` ${seatId}번 좌석의 예매를 취소하시겠습니까?`)) {
                await fetcher(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
                    method: "POST"
                });
                alert("예매가 취소되었습니다.");
                await reload();
            }
        } catch {
            alert("예매 취소에 실패했습니다.");
        }
    }
    const bookSeat = async (seatId) => {
        //좌석 예매 API 호출
        try {
            await fetcher(`http://localhost:8080/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({showtimeId, seatId})
            });
            alert("좌석이 예매되었습니다.");
            await reload();
        } catch {
            alert("좌석 예매에 실패했습니다.");
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await reload();
            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [showtimeId]);

    const grouped = useMemo(() => {
        const map = new Map();
        for (const s of seats) {
            if (!map.has(s.row)) {
                map.set(s.row, []);
            }
            map.get(s.row).push(s);
        }
        console.log(map);

        //정렬시켜서 배열로 반환
        const rows = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        console.log(rows);
        return rows.map(([row, list]) => ({
            row,
            seats: list.sort((a, b) => a.col - b.col)
        }));

    }, [seats]);

    return (
        <div className="mt-3">
            {/* 전체를 가운데 두고 싶으면 이 div로 정렬 */}
            <div style={{ textAlign: "center" }}>
                {/* 여기 박스의 너비 = 좌석 그리드 너비 */}
                <div style={{ display: "inline-block" }}>
                    {/* SCREEN + 상단 라인 */}
                    <div
                        className="text-center mb-3"
                        style={{
                            borderTop: "2px solid #ccc",
                            paddingTop: "8px",
                            fontWeight: "bold",
                            letterSpacing: "2px",
                            textAlign: "center",
                            // width: "100%" 이런 거 필요 없음
                        }}
                    >
                        SCREEN
                    </div>

                    {/* 행 / 열 좌석 버튼들 */}
                    {grouped.map(({ row, seats }) => (
                        <div
                            key={row}
                            className="d-flex align-items-center mb-2 justify-content-center"
                            style={{ gap: 8 }}
                        >
                            {/* 행 라벨 */}
                            <div
                                style={{
                                    width: 20,
                                    textAlign: "right",
                                    fontWeight: "bold",
                                }}
                            >
                                {row}
                            </div>

                            {/* 좌석 버튼들 */}
                            <div className="d-flex flex-wrap" style={{ gap: 6 }}>
                                {seats.map((s) => {
                                    let colorClass = "btn-outline-success";
                                    if (s.userTaken) {
                                        colorClass = 'btn-info'; //내가 예매한 좌석
                                    }
                                    else if (s.taken) { //불특정 다수 예매된 좌석
                                        colorClass = "btn-secondary";
                                    }
                                    return (
                                        <button
                                            key={s.id}
                                            type="button"
                                            disabled={s.taken && !s.userTaken} //내가 예매한 좌석은 다시 누를 수 있게
                                            className={`btn btn-sm ${colorClass}`}
                                            onClick={() => book(s)}
                                            style={{
                                                width: 40,
                                                height: 40,
                                                fontSize: 12,
                                                padding: 0,
                                                border: "2px solid green",
                                                color: "green",
                                            }}
                                            title={s.label}
                                        >
                                            {s.col}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};