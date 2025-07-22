# 설문 플랫폼 프로젝트

본 프로젝트는 네이버 폼의 주요 기능들을 팀 협업을 통해 완성하는 것을 목표로 합니다.

## 기술 스택

-   **프레임워크:** React (Vite)
-   **언어:** TypeScript
-   **CSS 프레임워크:** Tailwind CSS
-   **UI 라이브러리:** shadcn/ui
-   **백엔드 (예정):** Supabase

## 시작하기

프로젝트를 로컬 환경에서 실행하기 위한 단계별 안내입니다.

1.  **저장소 클론:**

    ```bash
    git clone https://github.com/XinKer-Kim/surveyForm.git
    cd surveyForm
    ```

2.  **의존성 설치:**

    ```bash
    npm install
    ```

3.  **환경 변수 설정:**
    프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 Supabase 프로젝트 정보를 입력합니다.

    ```
    VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
    VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

    `YOUR_SUPABASE_URL`과 `YOUR_SUPABASE_ANON_KEY`는 본인의 Supabase 프로젝트 설정에서 확인할 수 있습니다.

4.  **개발 서버 실행:**

    ```bash
    npm run dev
    ```

    이제 웹 브라우저에서 `http://localhost:5173` (또는 Vite가 제공하는 주소)로 접속하면 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
├── src
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── ui/       // shadcn/ui 컴포넌트
│   │   ├── form/     // 폼 관련 컴포넌트
│   │   └── layouts/  // 레이아웃 관련 컴포넌트
│   ├── hooks/        // 커스텀 훅
│   ├── pages/        // 페이지 컴포넌트
│   ├── types/        // 타입 정의
│   ├── utils/        // 유틸리티 함수
│   ├── supabaseClient.ts // Supabase 클라이언트 설정
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
└── README.md
```

## 팀원
