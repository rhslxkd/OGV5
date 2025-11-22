import "../assets/css/forbiddenPage.css";
import {Link} from "react-router-dom";

function ForbiddenPage() {
    return (
      <div className="container">
          <div className="content">
              <h1 className="text">403 - FORBIDDEN</h1>
              <p className="text2">이 리소스에 접근할 권한이 없습니다.</p>
              <img src={require('../assets/images/img.png')} alt={"히"} />
              <div className="actions">
                  <Link to="/" className="btn home-btn">홈으로</Link>
              </div>
          </div>
      </div>
    );
}
export default ForbiddenPage;