# Cursor Rules Cho Software Engineers

## Giới thiệu

Cursor Rules là các hướng dẫn markdown giúp AI assistant hiểu rõ hơn về codebase, coding standards và best practices của dự án. Dưới đây là các rule quan trọng nhất mà software engineer nên sử dụng.

## 1. Nguyên tắc cơ bản về Code Style và Structure

```md
# Code Style và Structure

## Nguyên tắc chung
- Viết code TypeScript ngắn gọn, kỹ thuật với ví dụ chính xác
- Sử dụng functional và declarative programming patterns; tránh classes
- Ưu tiên iteration và modularization thay vì code duplication
- Sử dụng tên biến mô tả với auxiliary verbs (ví dụ: isLoading, hasError)
- Cấu trúc file: exported component, subcomponents, helpers, static content, types

## Quy tắc cơ bản
- Không có unused variables
- Với multi-line if statements, sử dụng curly braces
- Luôn handle error function parameter và error trong try/catch blocks
- Sử dụng camelCase cho variables và functions
- Sử dụng PascalCase cho constructors và React components

## Naming Conventions
- Sử dụng lowercase với dashes cho directories (ví dụ: components/auth-wizard)
- Ưu tiên named exports thay vì default exports
```

## 2. TypeScript Best Practices

```md
# TypeScript Usage

## Type Safety
- Sử dụng TypeScript cho tất cả code; ưu tiên interfaces hơn types
- Tránh enums; sử dụng maps thay thế
- Sử dụng functional components với TypeScript interfaces
- Sử dụng strict mode trong TypeScript cho type safety tốt hơn
- Không bao giờ sử dụng `any` type

## Function Parameters
- Luôn pass parameters như một object duy nhất (named parameters pattern)

```typescript
// Tốt
function doSomething({ id, name }: { id: string; name: string }) { /* ... */ }

// Không tốt
function doSomething(id: string, name: string) { /* ... */ }
```

## Imports và Exports
- Sử dụng shorter imports qua path aliases (ví dụ: `@/components/...`)
- Không sử dụng index exports; sử dụng named exports và import modules trực tiếp

```typescript
// Tốt
import { Button } from '@/components/shared/ui/button';

// Không tốt
import { Button } from '@/components/shared/ui';
```
```

## 3. React Best Practices

```md
# React Best Practices

## Component Structure
- Sử dụng functional components với TypeScript interfaces
- Implement hooks đúng cách (useState, useEffect, useContext, useReducer, useMemo, useCallback)
- Follow Rules of Hooks (chỉ gọi hooks ở top level, chỉ gọi hooks từ React functions)
- Tạo custom hooks để extract reusable component logic
- Ưu tiên composition hơn inheritance

## Performance Optimization
- Minimize 'use client', 'useEffect', và 'setState'; ưu tiên React Server Components (RSC)
- Wrap client components trong Suspense với fallback
- Sử dụng dynamic loading cho non-critical components
- Optimize images: sử dụng WebP format, include size data, implement lazy loading

## Error Handling
- Prioritize error handling và edge cases
- Handle errors và edge cases ở đầu functions
- Sử dụng early returns cho error conditions để tránh deeply nested if statements
- Implement error boundaries để catch và handle errors gracefully
```

## 4. UI và Styling (Tailwind CSS)

```md
# UI và Styling với Tailwind CSS

## Class Organization
Organize Tailwind classes theo thứ tự logic:
1. Layout/positioning classes trước
2. Sizing classes
3. Spacing (margin/padding)
4. Visual styles (colors, borders)
5. Typography
6. Interactive states
7. Responsive variants cuối cùng

```tsx
className="flex flex-col gap-4 w-full p-6 bg-primary-100/20 text-sm hover:bg-primary-200/30 md:flex-row"
```

## Responsive Design
- Mobile-first approach (base classes cho mobile, prefixed classes cho larger screens)
- Sử dụng responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`

## Color System
- Sử dụng semantic color naming với numeric scale (primary-100, primary-900)
- Apply opacity với slash notation: `bg-primary-100/20`
- Sử dụng consistent dark mode variants: `dark:bg-primary-900/10`
```

## 5. Error Handling và Validation

```md
# Error Handling và Validation

## Nguyên tắc cơ bản
- Prioritize error handling và edge cases
- Handle errors và edge cases ở đầu functions
- Sử dụng early returns cho error conditions để tránh deeply nested if statements
- Place happy path cuối cùng trong function để cải thiện readability
- Tránh unnecessary else statements; sử dụng if-return pattern

## Validation
- Sử dụng Zod cho form validation và runtime validation
- Implement proper error logging và user-friendly error messages
- Sử dụng custom error types hoặc error factories cho consistent error handling

```typescript
// Ví dụ Zod schema
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
});

type User = z.infer<typeof userSchema>;
```
```

## 6. Performance Optimization

```md
# Performance Optimization

## Frontend Performance
- Minimize sử dụng 'use client', 'useEffect', và 'setState'
- Ưu tiên React Server Components (RSC)
- Wrap client components trong Suspense với fallback
- Sử dụng dynamic loading cho non-critical components
- Optimize images: WebP format, size data, lazy loading
- Implement code splitting và lazy loading với React's Suspense

## Caching và Data Fetching
- Sử dụng React Query/TanStack Query cho data fetching và caching
- Leverage proper caching strategies
- Avoid excessive API calls
- Implement proper error boundaries cho unexpected errors

## Key Conventions
- Optimize Web Vitals (LCP, CLS, FID)
- Limit 'use client': ưu tiên server components và Next.js SSR
- Sử dụng 'use client' chỉ cho Web API access trong small components
```

## 7. Security Best Practices

```md
# Security Best Practices

## Input Validation và Sanitization
- Sanitize user inputs để prevent XSS attacks
- Sử dụng dangerouslySetInnerHTML sparingly và chỉ với sanitized content
- Implement proper input validation ở cả client-side và server-side

## Data Handling
- Sử dụng HTTPS cho tất cả API communications
- Implement proper authentication và authorization
- Store sensitive data securely
- Use environment variables cho sensitive configuration

## Server Security
- Enforce data access control
- Implement rate limiting
- Use proper CORS configuration
- Validate và sanitize tất cả inputs
```

## 8. Testing Guidelines

```md
# Testing Guidelines

## Unit Testing
- Viết unit tests cho components sử dụng Jest và React Testing Library
- Test behavior không phải implementation
- Mock external dependencies
- Sử dụng data-testid cho testing selectors

## Integration Testing
- Implement integration tests cho critical user flows
- Test API endpoints với proper test data
- Sử dụng proper test environments

## Best Practices
- Follow naming conventions cho test files
- Keep tests focused và isolated
- Use descriptive test names
- Implement proper setup và teardown
```

## 9. Project Structure và Organization

```md
# Project Structure

## Folder Organization
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── forms/        # Form components
│   └── layout/       # Layout components
├── hooks/            # Custom hooks
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
├── utils/            # Helper functions
└── constants/        # App constants
```

## File Naming
- Sử dụng kebab-case cho directories
- Sử dụng PascalCase cho React components
- Sử dụng camelCase cho utilities và hooks
- Sử dụng lowercase với dashes cho config files

## Code Organization
- Organize code by feature khi project lớn
- Keep related files gần nhau
- Separate business logic khỏi UI components
- Use barrel exports (index files) sparingly
```

## 10. Documentation Standards

```md
# Documentation Standards

## TSDoc Comments
- Sử dụng TSDoc cho function và class documentation
- Document complex business logic
- Không comment obvious things
- Chỉ document extraordinary changes hoặc complex logic

```typescript
/**
 * Calculates the total price including tax and discounts
 * @param basePrice - The base price before calculations
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param discountPercent - Discount percentage (0-100)
 * @returns The final calculated price
 */
function calculateTotal(basePrice: number, taxRate: number, discountPercent: number): number {
  // Implementation
}
```

## README và Documentation
- Maintain up-to-date README files
- Document API endpoints
- Include setup instructions
- Document environment variables và configuration
```

## 11. Database và Backend Best Practices

```md
# Database Best Practices

## Schema Design
- Sử dụng proper relational design principles
- Implement proper constraints
- Use meaningful table và column names
- Follow consistent naming conventions

## Query Optimization
- Use indexes effectively
- Avoid N+1 queries
- Implement proper pagination
- Use query builders hoặc ORMs safely

## Data Access
- Implement proper data access layers
- Use transactions khi cần thiết
- Handle database errors gracefully
- Implement proper connection pooling
```

## 12. Deployment và DevOps

```md
# Deployment Best Practices

## Environment Management
- Sử dụng environment variables cho configuration
- Separate environments (dev, staging, production)
- Implement proper CI/CD pipelines
- Use proper secret management

## Performance Monitoring
- Implement application monitoring
- Track performance metrics
- Set up proper logging
- Monitor error rates và response times

## Security
- Implement proper SSL/TLS
- Use security headers
- Regular security updates
- Implement proper backup strategies
```

## Kết luận

Các Cursor rules này sẽ giúp AI assistant hiểu rõ hơn về coding standards và best practices, từ đó generate code chất lượng cao hơn. Software engineers nên:

1. **Customize rules theo project**: Điều chỉnh rules phù hợp với tech stack và requirements cụ thể
2. **Update rules thường xuyên**: Cập nhật khi có new patterns hoặc best practices
3. **Share với team**: Đảm bảo tất cả team members sử dụng cùng standards
4. **Monitor và improve**: Theo dõi quality của generated code và improve rules accordingly

Việc sử dụng đúng Cursor rules sẽ:
- Tăng consistency trong codebase
- Giảm bugs và security vulnerabilities  
- Cải thiện maintainability
- Tăng productivity của development team
- Đảm bảo code quality standards

Cursor → Settings → Cursor Settings → Rules for AI

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

.cursor/
├── rules/
│   ├── react.mdc
│   ├── typescript.mdc
│   ├── database.mdc
│   └── testing.mdc