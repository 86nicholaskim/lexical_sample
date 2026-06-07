# Lexical + React 게시판 구현 계획 (AST 연동 버전)

## 1. 개요
TypeScript `interface`로 정의된 AST(Abstract Syntax Tree) 구조를 Lexical의 `DecoratorNode`와 매핑하여, 구조화된 데이터를 에디터 내에서 리액트 컴포넌트로 렌더링하는 게시판을 구현합니다.

## 2. 기술 스택
- **Framework**: React 19, Vite
- **Language**: TypeScript
- **Editor**: Lexical 0.45.0

## 3. 핵심 구현 내용

### 3.1 AST 인터페이스 정의 (`src/types/ast.ts`)
- 컴포넌트의 타입, 속성(title, content, variant)을 정의하는 interface 구축
- 강한 타입 체크를 통해 에디터 내 데이터 무결성 보장

### 3.2 AST Decorator Node (`src/nodes/ASTDecoratorNode.tsx`)
- `DecoratorNode<React.ReactNode>`를 상속
- 내부 상태로 `__ast: ComponentAST`를 보유
- `decorate()` 메서드에서 AST 데이터를 기반으로 스타일링된 리액트 컴포넌트 반환
- `importJSON`, `exportJSON`을 통해 AST 데이터를 포함한 직렬화 지원

### 3.3 에디터 플러그인 (`src/plugins/`)
- `InsertASTPlugin.tsx`: 버튼 클릭 시 특정 AST 구조를 생성하여 에디터에 삽입
- `OnChangePlugin.tsx`: 에디터 상태가 변할 때마다 JSON으로 직렬화하여 부모 컴포넌트에 전달
- `ExternalStatePlugin.tsx`: 외부 상태(React)를 감시하여 Lexical 노드로 자동 변환

### 3.4 UI 컴포넌트 (`src/components/`)
- `CustomUI.tsx`: AST 데이터를 시각화하는 리액트 컴포넌트
- `PipelineTracer.tsx`: 데이터 흐름을 추적하는 대시보드 컴포넌트

## 4. 실행 방법
1. `pnpm install`
2. `pnpm exec vite`
3. 브라우저에서 버튼을 눌러 AST 기반의 카드/경고/상태 컴포넌트를 삽입해보세요.

## 5. 구현 결과
- [x] TypeScript AST Interface 정의
- [x] AST 데이터를 관리하는 커스텀 DecoratorNode 구현
- [x] AST 삽입 플러그인 및 에디터 연동 완료
- [x] 전체 타입 체크(`tsc`) 통과
