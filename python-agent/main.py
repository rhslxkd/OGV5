## Fast API 클래스를 불러옴 -> 이 클래스는 실제 웹 서버 인스턴스를 만들 수 있게됨
from fastapi import FastAPI

## 클래스를 호출해서 "인스턴스(app)"를 만들어야 라우팅이 동작함
app = FastAPI()

## GET방식으로 /movie 경로에(사이트) 접근하면 아래 함수를 실행하라는 뜻
@app.get("/")
def movie_check():
    return { ## Json 형식이 반환됨
        "status":"ok",
        "service":"python-agent"
    }