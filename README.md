# 📖 Share Your Docs 

나만의 문서를 작성하고 친구와 함께 작업할 수 있는 공간

🌍 배포 링크: https://share-your-docs.netlify.app/

> 1. 개발 기간: 2024. 10. 14 ~ 2024. 10. 18 <br/>
> 2. Notion hommage (Notion-like application)

## 1️⃣ 실행 방법

#### 기본적으로 배포 링크에 들어가서 접속하셔서 서비스를 이용하시면 됩니다.

#### 아래 내용은 IDE에 clone 시 실행 방법을 안내하였습니다.

### 1. Quick Start Guide

```jsx
$ git clone https://github.com/SsongQ-92/share-your-docs.git
$ npm install
$ npm run build
$ npm run preview

https://localhost:4173/ 접속
```

### 2. 상세 내용

터미널에 아래와 같이 명령어를 입력 후, `package.json`에 명시되어 있는 각 dependencies를 설치합니다.

```
npm install
```

각 node packages가 설치되었다면, application을 실행할 준비가 되었습니다.

#### 1) 개발 서버

터미널에 아래와 같이 명령어를 입력 후, vite 개발 서버를 실행시킵니다.

```
npm run dev
```

아래와 같은 로그가 출력된다면 성공입니다. 아래 링크를 control + click하여 실행합니다.

```
VITE v4.5.5 

-> Local: http://localhost:5173/
-> Network: use --host to expose
-> press h to show help
```

#### 2) 프로덕션 빌드

```
npm run build
```

```
npm run preview
```

아래와 같은 로그가 출력된다면 성공입니다. 아래 링크를 control + click하여 실행합니다.

```
-> Local: http://localhost:4173/
-> Network: use --host to expose
-> press h to show help
```

#### 3) 추가사항: firebase 관련

추가로, firebase 서비스(로그인 및 realtime database)를 이용하시기 위해서는 firebase 환경변수가 필요한데요. 

firebase 에서 프로젝트 앱 생성 후, auth, realtime database에 대한 제품의 SDK를 아래와 같이 `.env.local` 파일을 생성하시어 작성해주시면 됩니다.

```
VITE_API_KEY="본인꺼 적기"
VITE_AUTH_DOMAIN="본인꺼 적기"
VITE_PROJECT_ID="본인꺼 적기"
VITE_STORAGE_BUCKET="본인꺼 적기"
VITE_MESSAGING_SENDER_ID="본인꺼 적기"
VITE_APP_ID="본인꺼 적기"
VITE_DATABASE_URL="본인꺼 적기"
```

## 2️⃣ 폴더 구조

```
├── public
│   ├── assets
│   └── icon.svg
├── src
│   ├── components
│   │   ├── Button
│   │   ├── Card
│   │   ├── Chip
│   │   ├── Header
│   │   ├── Input
│   │   ├── Noti
│   │   ├── UI
│   │   ├── Pages
│   │   └── App.jsx
│   ├── constants
│   ├── hooks
│   ├── services/slices
│   ├── store
│   ├── styles
│   │   └── globals.css
│   ├── utils
│   ├── firebase.js
│   └── main.jsx
├── package.json
└── index.html
```

## 3️⃣ URL path 구조

### 1. Landing Page (`/`)

- 랜딩 페이지 입니다. 
- Docs List Page와 Create Doc Page로 이동 가능합니다.

### 2. Docs List Page (`/docs/lists`)

- 내가 생성한 문서 리스트를 확인할 수 있습니다.
- 문서 리스트 목록에서 링크를 클릭하여 공유 페이지로 이동 가능합니다.

### 3. Create Doc Page (`/docs/new`)

- 새로운 문서를 생성할 수 있습니다.
- 수동 및 자동 저장 기능이 지원됩니다.

### 4. Edit Doc Page via shared link (`/docs/:docId`)

- 서버의 변경 사항이 실시간 반영됩니다.
- 자동 저장 기능이 지원됩니다.
- 최대 2인까지 작업 가능합니다.

### 5. Not Found Page a.k.a. 404 Page (`/*`)

## 4️⃣ 기술 스택

**Front End**

- React
- JavaScript

**React Used**

- tailwindcss
- zustand
- react-router-dom

**Etc**

- netlify
- vite
- firebase
