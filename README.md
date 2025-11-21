# OGV5

AI 기반 영화 예매 & 자동 응답 시스템 프로젝트입니다.  
기존 OGV4 코드를 기반으로, **Spring Boot + React + Python AI Agent** 구조로 재설계하여
GitHub 브랜치 전략과 AI 워크플로우를 함께 실험하는 것을 목표로 합니다.

---

## 🎯 프로젝트 목표

- 영화 예매 정보를 제공하는 **웹 서비스 백엔드/프론트엔드** 구현
- **AI Agent(LLM)** 를 이용해:
  - 영화/상영시간/좌석 관련 자연어 질의 응답
  - 예매 절차 안내 및 일부 자동화
- 향후 **Vector DB**를 도입해:
  - 유저 히스토리 기반 맞춤 추천
  - FAQ/공지/이벤트 정보를 검색·응답하는 RAG 구조로 확장

---

## 🏗️ 아키텍처 (계획)

- **backend/**  
  - Spring Boot  
  - 영화, 상영시간, 좌석, 예매 등 도메인 API 제공
- **frontend/**  
  - React  
  - 영화 목록/상세/예매 UI, AI 챗봇 인터페이스
- **python-agent/**  
  - FastAPI + Google ADK Agent  
  - LLM 호출, 도구(tool) 오케스트레이션  
  - 향후 Vector DB 연동 예정
- **docs/**  
  - 시스템 아키텍처, ERD, 시퀀스 다이어그램 등 문서

---

## 🔧 기술 스택

- **Backend:** Java, Spring Boot, JPA
- **Frontend:** React
- **AI / Agent:** Python, FastAPI, Google ADK (Gemini 기반)
- **DB:** (개발 중 – MySQL 또는 MariaDB 예정)
- **협업 / 관리:** GitHub Issues, Projects, Branch 전략(main / dev / feature-*)

---

## 📌 진행 현황

- [O] GitHub 레포 생성 (OGV5)
- [O] 기본 폴더 구조 생성 (backend / frontend / python-agent / docs)
- [ ] Spring Boot 기반 backend 골격 이식 (OGV4 → OGV5)
- [ ] React 프론트엔드 초기 화면 구성
- [ ] Python AI Agent 서버 기본 `/chat` 엔드포인트 구현
- [ ] Vector DB 연동 기획 및 PoC

---

## 🚀 향후 계획

1. 기존 OGV4 백엔드/프론트 코드를 OGV5 구조로 단계적 이식  
2. Python AI Agent 서버와 backend 간 연동 (REST API 기반)  
3. 영화 정보/FAQ를 Vector DB에 저장하고,  
   LLM + Agent로 RAG 질의 응답 실험  
4. 최종적으로 “사용자가 자연어로 물어보면,  
   **AI가 안내 + 예매 흐름까지 자동으로 유도하는 시스템** 완성

