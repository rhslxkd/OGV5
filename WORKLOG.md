## OGV5 개발 기록.
# 📘 OGV5 GitHub 프로젝트 초기 세팅 기록 (2025.11.21)

> 실무형 GitHub 모노레포 프로젝트를 처음 셋업할 때의 모든 과정 정리.
> Spring Boot + React + FastAPI 기반의 3-Service 구조.

---

## 🧱 1. GitHub 저장소 생성

* **Repository Name:** `OGV5`
* **Description:** "OGV5 Multi-Service Architecture"
* **공개 여부:** 🔓 **Public Repository**
* 🔓 Public Repo (공개 저장소) VS 🔐 Private Repo (비공개 저장소)
* Puvlic은 누구나 볼 수 있는 레포이며, 검색에도 잡힘.
> 장점: 포트폴리오 효과, 취업 임시용, 팀프로젝트를 할 떄 공유와 생태계관리가 쉬움
> 단점: 보안에 취약해서 API키, 개인정보, 민감한 코드는 절대 넣으면 안됨
* Private는 반면 오직 초대된 사람(권한이 부여된)만 볼 수 있는 레포
> 장점: 회사/수업/연구실 프로젝트에 필수, 민감한코드를 올려도 보안측면에서 그나마 안전, 협업할 때 권한 조절 가능(읽기/쓰기)
> 단점: 포트폴리오로 활용하기 애매함. 외부인에게 보여주려면 초대를 해야함 

```bash
# 기본 생성 구조
OGV5/
 └─ README.md
```

**브랜치 전략:**

* 기본 브랜치: `main`
* 작업 브랜치: `dev` ---나중에 main으로 merge(PR)를 하여 main이 dev 코드를 그대로 받을 수 있음

* 만드는 법 (Git bash /IDE내 터미널 /기본터미널 등등)
```bash
cd /e/study/Projects - 원하는 경로로
git clone https://github.com/rhslxkd/OGV5.git - repo http 경로
cd OGV5 
git checkout -b dev -branch dev를 만듬과 동시에 dev로 전환
```

---

## 📂 2. 기본 디렉토리 구조 생성

*반드시 dev 상태에서 실행! 환경 설정 끝난후 오류 없을시에 main으로 보낼 예정
```bash
mkdir backend frontend python-agent docs
ls -a
```
* ls 를 실행했을 시 보이지 않으면 -> .gitkeep을 만들어서 확인 가능.
* 최종 구조
```bash
OGV5/
 ├─ backend/ -SpringBoot가 들어갈 디렉토리
 ├─ frontend/ -React가 들어갈 디렉토리(Node.js)
 ├─ python-agent/ -Python이 들어갈 디렉토리
 ├─ docs/
 └─ README.md
```
* 변경사항 저장.
```bash
git status -현재 github에 저장 안된 내용(수정, 새로 생성)확인
git add . - 추가
git commit -m "chore: initialize backend/frontend/python-agent/docs directories" -커밋
git push origin dev -dev로 push(중요!)
```
* commit message 정리:
> chore: 코드와 관련없는 것들을 커밋할 때.
> feat: 새로운 코드작성, 수정했을 때.
> fix: 오류 수정시 커밋할 때.

---

## ☕ 3. Spring Boot Backend (IntelliJ)-환경설정

* **Java 17 / Gradle**
* Dependencies: Spring Web, Spring Data JPA, Spring Security, Lombok, Validation, Spring Data JDBC, Oracle Driver

* 프로젝트 생성.
> 프로젝트 생성시. backend/backend로 파일이름이 충돌됐음. UI문제로 프로젝트를 생성하는 과정에서 겹치게 됐는데, 이를 해결한 방법은 간단히 복사 붙혀넣기 + 덮어씌우기.
> 이로인해 문제발생(build.gradle을 compile할 수 없었음-아마 강제 경로 변경이 원인으로 추정)
> 그로 인해 디스크에서 다시 로드 + 캐시 삭제및 재시작 실행.

```bash
# 위치 확인
OGV5/backend/build.gradle
OGV5/backend/src/...
```

* backend 환경 github에 저장.
```bash
git add .
git commit -m "feat: initialize Spring Boot backend project"
git push origin dev
```

---

## ⚛️ 4. React Frontend (Vite)

```bash
cd frontend
npx create-react-app - react.app 생성 -> node_modules, src/..등등 파일 생성
```

```bash
cd frontend
npm install react-router-dom npm install react-hook-form - 필수 플러그인 다운로드
```

* frontend 환경 저장.
```bash
git add .
git commit -m "feat: initialize React frontend"
git push origin dev
```

---

## 🐍 5. Python Agent (FastAPI)

```bash
cd python-agent
python -m venv .venv -가상환경 설치(파이썬은 충돌이 많기때문에 가상환경을 설치해줘야함)
.venv\Scripts\activate -활성화
pip install fastapi uvicorn -서버 open을 하기 위한 FastAPI 설치
```

`main.py` 예시:

```python
## Fast API 클래스를 불러옴 -> 이 클래스는 실제 웹 서버 인스턴스를 만들 수 있게됨
from fastapi import FastAPI

## 클래스를 호출해서 "인스턴스(app)"를 만들어야 라우팅이 동작함
app = FastAPI()

## GET방식으로 / 경로에(사이트) 접근하면 아래 함수를 실행하라는 뜻
@app.get("/")
def movie_check():
    return { ## Json 형식이 반환됨
        "status":"ok",
        "service":"python-agent"
    }
- 프로젝트 뼈대 구조 완성
```
*Python-agent환경 저장
```bash
git add .
git commit -m "feat: initialize python for python-agent"
git push origin dev
```

→ Merge Pull Request 실행


---

## 🔄 9. 로컬 main 최신화

```bash
git checkout main
git pull origin main
git checkout dev
```

앞으로의 모든 작업은 `dev` 브랜치에서 진행 후, `main`으로 PR.

---

## ✅ 오늘 성과 요약

* GitHub Repository 생성 및 브랜치 전략 정립
* Spring Boot / React / FastAPI 각 서비스 초기화 완료
* 실무 수준의 모노레포 구조 확립
* 서비스별 .gitignore 구성 정리
* FastAPI 200 OK 테스트 성공
* dev → main PR 생성 및 병합 완료
