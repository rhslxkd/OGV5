import {useState, useEffect} from "react";

function Member() {

    const [Member, setMember] = useState([]);
    useEffect(() => {
        console.log('회원입니다')
        fetch('http://localhost:8080/api/member/main')
            .then((res) =>res.json())
            .then((data) => setMember(data));
    }, []);

    return (
        <div>
            <h1>회원목록 입니다.</h1>
            <table border="1">
                <tr>
                    <th>회원 id</th>
                    <th>회원 password</th>
                    <th>회원 이름</th>
                    <th>가입날짜</th>
                </tr>
                {Member.map(me => (
                    <tr key={me.id}>
                        <td>{me.id}</td>
                        <td>{me.pass}</td>
                        <td>{me.name}</td>
                        <td>{me.regdate}</td>
                    </tr>
                ))}
            </table>
        </div>
    )

}
export default Member;