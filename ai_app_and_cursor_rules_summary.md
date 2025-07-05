# Tổng hợp kiến thức phát triển ứng dụng AI & Cursor Rules cho Software Engineer

## 1. Tổng quan phát triển ứng dụng AI hiện đại

- **Các bước chính:**
  1. Xác định bài toán & dữ liệu
  2. Tiền xử lý dữ liệu (ETL, clean, split, augment)
  3. Chọn mô hình (pretrained, fine-tune, custom)
  4. Triển khai inference (API, batch, streaming)
  5. Đánh giá, giám sát, tối ưu
  6. Đưa vào production (CI/CD, monitoring, rollback)

- **Các công nghệ phổ biến:**
  - Python, PyTorch, TensorFlow, HuggingFace, LangChain, OpenAI API, FastAPI, Docker, Kubernetes, MLflow, Weights & Biases, Supabase, Postgres, Redis, Kafka, S3, Next.js, React, TypeScript, TailwindCSS, Shadcn/ui, Zod.

- **Best practice:**
  - Tách biệt pipeline training và serving
  - Sử dụng versioning cho model & data
  - Logging, monitoring, alerting đầy đủ
  - Test kỹ từng bước (unit, integration, e2e)
  - Bảo mật API, kiểm soát truy cập, rate limit

---

## 2. Cursor Rules cho Software Engineer

### 2.1. Cách tổ chức rules

- **Global:**  
  `Cursor → Settings → Cursor Settings → Rules for AI`
- **Project:**  
  Tạo `.cursorrules` hoặc `.cursor/index.mdc` ở root
- **Context-aware:**  
  `.cursor/rules/react.mdc`, `.cursor/rules/typescript.mdc`, v.v.

### 2.2. Rule mẫu cho project AI

```markdown
# Project Rules

## Code Style
- Use TypeScript for all code
- Prefer functional components
- Use camelCase for variables
- Use PascalCase for components

## Tech Stack
- Next.js 14 with App Router
- Tailwind CSS for styling
- Shadcn/ui for components
- Zod for validation
```

### 2.3. Best practice khi viết rules

- Ngắn gọn, rõ ràng, cụ thể
- Ưu tiên các rule về style, naming, error handling, security, testing
- Tách rule theo context (frontend, backend, database, testing)
- Cập nhật rules khi có thay đổi lớn trong codebase

---

## 3. Usecase thực tế

### 3.1. Prompt hiệu quả cho AI code assistant

**Prompt tốt:**
```
Tạo một API POST /api/chat cho ứng dụng chat AI:
- Validate input với Zod (message: string, userId: string)
- Sử dụng OpenAI API để sinh response
- Lưu lịch sử chat vào Postgres
- Xử lý lỗi rõ ràng, trả về status code phù hợp
- Viết unit test cho endpoint này
```

**Prompt không tốt:**
```
Tạo API chat
```

### 3.2. Tích hợp AI vào web app

- Sử dụng Next.js API routes để wrap model inference
- Dùng React Query/TanStack Query để fetch kết quả AI
- Hiển thị loading, error, retry logic rõ ràng
- Lưu lịch sử tương tác vào database
- Thêm analytics/tracking cho các event AI

---

## 4. Cụ thể hóa best practice

### 4.1. TypeScript & React

- Luôn dùng interface cho props, tránh any
- Tách logic AI call ra custom hook (useChat, useCompletion)
- Sử dụng Suspense, lazy loading cho component nặng
- Đảm bảo accessibility (aria-label, keyboard nav)
- Test với React Testing Library, mock API

### 4.2. API & Backend

- Validate input với Zod hoặc Pydantic
- Xử lý lỗi rõ ràng, log đầy đủ context
- Sử dụng async/await, try/catch, early return
- Tách config (API key, endpoint) ra env
- Đảm bảo bảo mật: rate limit, auth, CORS

### 4.3. DevOps & CI/CD

- Dockerize app, multi-stage build
- Tự động test, lint, format trước khi deploy
- Monitor error, performance (Sentry, Datadog)
- Rollback nhanh khi có sự cố

---

## 5. Tài nguyên hữu ích

- [Cursor Rules Docs](https://docs.cursor.com/context/rules)
- [Awesome Cursor Rules](https://www.notsobrightideas.com/cursorrules)
- [Shipixen Cursor Rules Example](https://shipixen.com/boilerplate-documentation/shipixen-cursor-rules-explained)
- [LangChain Docs](https://python.langchain.com/docs/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers/index)
- [MLflow](https://mlflow.org/)

---

## 6. Checklist khi phát triển ứng dụng AI

- [ ] Định nghĩa rõ bài toán, success metric
- [ ] Chọn tech stack phù hợp
- [ ] Viết rules cho codebase
- [ ] Tách biệt training, serving, monitoring
- [ ] Test kỹ từng bước
- [ ] Đảm bảo bảo mật, logging, alerting
- [ ] Viết tài liệu, hướng dẫn sử dụng

---

**Bạn có thể copy phần trên vào file `ai_app_and_cursor_rules_summary.md` để làm tài liệu tổng hợp cho team hoặc project. Nếu cần chi tiết từng phần, hãy yêu cầu cụ thể hơn!** 