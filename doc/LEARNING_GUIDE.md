# Lexical + React: 단계별 마스터 가이드

이 가이드는 Lexical 에디터의 핵심 개념부터 AST 연동, 그리고 리액트 데코레이터를 통한 시각화까지 단계별로 설명합니다.

---

## 🟢 Chapter 1: Lexical의 기본 개념

### 1.1 Lexical이란?
Lexical은 Meta에서 만든 확장 가능하고 신뢰할 수 있는 리치 텍스트 에디터 프레임워크입니다.
- **Editor State**: 에디터의 모든 데이터는 불변(Immutable) 상태로 관리됩니다.
- **Nodes**: 모든 텍스트, 단락, 이미지는 '노드'라는 단위로 구성됩니다.
- **Commands**: 에디터 조작(볼드체, 삽입 등)은 커맨드 시스템을 통해 이루어집니다.

### 1.2 핵심 컴포넌트
- `LexicalComposer`: 에디터의 설정을 정의하고 컨텍스트를 제공합니다.
- `RichTextPlugin`: 텍스트 입력을 가능하게 하는 핵심 플러그인입니다.
- `ContentEditable`: 실제 텍스트가 입력되는 DOM 영역입니다.

---

## 🔵 Chapter 2: AST(Abstract Syntax Tree) 개념과 매핑

### 2.1 AST란?
코드나 문서를 구조화된 객체 형태로 표현한 것입니다. Lexical 내부 상태도 일종의 AST입니다.

### 2.2 왜 외부 객체를 AST로 바꾸나요?
외부 데이터(JSON)는 에디터가 이해하는 형식이 아닙니다. 이를 에디터가 처리할 수 있는 **중간 규격(AST Interface)**으로 변환해야 안정적인 렌더링이 가능합니다.

**매핑 예시:**
```typescript
// 1. 외부 데이터 (Raw)
{ "user_msg": "Hello", "type": "urgent" }

// 2. 중간 AST (우리 약속)
{ "type": "alert", "properties": { "content": "Hello", "variant": "error" } }

// 3. Lexical Node (에디터 내부)
new ASTDecoratorNode(ast)
```

---

## 🟡 Chapter 3: DecoratorNode와 DOM 생성

### 3.1 DecoratorNode란?
텍스트 에디터 안에 **리액트 컴포넌트**를 "장식(Decorate)" 하듯이 끼워넣는 특수한 노드입니다.

### 3.2 DOM 생성의 두 단계
1.  **`createDOM()`**: 
    - 에디터가 노드를 놓을 "자리(DIV)"를 만듭니다. 
    - 순수 JavaScript로 작성됩니다.
2.  **`decorate()`**: 
    - 그 "자리" 안에 들어갈 **실제 UI**를 리액트로 렌더링합니다.
    - 리액트의 상태 관리, 이벤트 핸들링을 그대로 사용할 수 있습니다.

---

## 🔴 Chapter 4: 소스코드 실습 구조

- `src/types/ast.ts`: 데이터의 규격을 정의 (Interface)
- `src/nodes/ASTDecoratorNode.tsx`: 데이터가 에디터 노드가 되는 로직 (Logic)
- `src/Editor.tsx`: 노드를 삽입하고 관리하는 도구 (Plugin)
---

## 🟣 Chapter 5: 라이프사이클 및 동기화 (Sync)

### 5.1 초기 렌더링 (Initial Render)
1. 리액트의 `rawInput` 상태가 초기화됩니다.
2. `LexicalComposer`가 초기 설정을 읽어 에디터 엔진을 기동합니다.

### 5.2 상태 변경 및 데이터 생성
1. 사용자가 대시보드에서 입력값을 수정하면 리액트의 `rawInput` 상태가 바뀝니다.
2. "Pipeline 실행" 버튼을 누르면 이 데이터가 `ExternalStatePlugin`으로 전달됩니다.

### 5.3 Lexical 라이프사이클 (The Update)
1. **`editor.update()`**: 에디터 상태를 변경할 수 있는 유일한 통로입니다.
2. **Node Creation**: `new ASTDecoratorNode(ast)`를 통해 불변 객체가 생성됩니다.
3. **AST Storage**: 전달받은 AST 데이터는 노드 내부의 `__ast` 필드에 안전하게 보관됩니다.

### 5.4 React 연결 (The Bridge)
1. Lexical 엔진이 화면을 그릴 때, 우리 노드의 `decorate()`를 호출합니다.
2. **React Portal**: Lexical은 에디터 DOM 내부에 리액트 컴포넌트를 렌더링할 수 있는 '자리'를 마련해줍니다.
3. **Final View**: 리액트 컴포넌트(`CustomUI`)는 `__ast`를 Props로 받아 일반적인 리액트 방식으로 최종 UI를 렌더링합니다.

이 구조 덕분에 에디터의 텍스트 편집 기능과 리액트의 강력한 UI 라이브러리를 충돌 없이 함께 사용할 수 있습니다.
