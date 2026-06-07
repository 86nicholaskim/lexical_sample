# Lexical AST Pipeline — 학습용 데모

TypeScript `interface`로 정의된 AST 구조를 Lexical의 `DecoratorNode`에 매핑하고, 에디터 내부에서 React 컴포넌트로 렌더링하기까지의 전체 데이터 흐름을 시각화하는 학습용 프로젝트입니다.

## 핵심 개념

> **"설정 인터페이스 → AST → Lexical Node → React UI"** 의 단방향 파이프라인

```
[Raw Data / External State]
        ↓  ComponentAST interface로 타입 검증
[AST Object]  (src/types/ast.ts)
        ↓  editor.update() 호출
[ASTDecoratorNode]  (src/nodes/ASTDecoratorNode.tsx)
        ↓  decorate() 실행
[React Component]  (src/components/CustomUI.tsx)
```

Lexical의 `EditorState`는 외부 React state와 **분리된 독립적인 source of truth**입니다. 이 프로젝트는 외부 데이터를 Lexical 세계로 안전하게 주입하는 패턴을 중점적으로 다룹니다.

---

## 기술 스택

| 항목 | 버전 |
|---|---|
| React | 19 |
| Lexical | 0.45.0 |
| TypeScript | 6 |
| Vite | 8 |
| 패키지 매니저 | pnpm 11 |

---

## 프로젝트 구조

```
src/
├── types/
│   └── ast.ts                  # ComponentAST 인터페이스 정의
├── nodes/
│   └── ASTDecoratorNode.tsx    # 커스텀 DecoratorNode (핵심)
├── plugins/
│   ├── ExternalStatePlugin.tsx # 외부 state → Lexical 노드 자동 주입
│   ├── InsertASTPlugin.tsx     # 버튼 클릭으로 노드 직접 삽입
│   └── OnChangePlugin.tsx      # EditorState 변경 시 JSON 직렬화
├── components/
│   ├── CustomUI.tsx            # AST 데이터를 받아 렌더링하는 React UI
│   └── PipelineTracer.tsx      # 파이프라인 단계별 추적 대시보드
├── Editor.tsx                  # LexicalComposer 설정 및 플러그인 조립
└── App.tsx                     # 전체 레이아웃 및 데이터 흐름 관리
```

---

## 파이프라인 상세

### 1단계 — AST Interface 정의 (`src/types/ast.ts`)

에디터에 삽입될 데이터의 **계약(contract)** 을 TypeScript interface로 정의합니다. 데이터가 Lexical 내부로 진입하기 전 타입 검증의 기준점 역할을 합니다.

```ts
export interface ComponentAST {
  type: 'info-card' | 'alert' | 'status';
  properties: {
    title: string;
    content: string;
    variant?: 'success' | 'alert' | 'info';
  };
}
```

### 2단계 — ASTDecoratorNode (`src/nodes/ASTDecoratorNode.tsx`)

`DecoratorNode<React.ReactNode>`를 상속해 AST 데이터를 Lexical의 `EditorState` 트리 안에 노드로 등록합니다.

```ts
export class ASTDecoratorNode extends DecoratorNode<React.ReactNode> {
  __ast: ComponentAST;

  // Lexical이 노드를 DOM에 배치할 컨테이너를 만듭니다
  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'block';
    return div;
  }

  // 내부 React 업데이트는 React가 담당하므로 false 반환
  updateDOM(): false { return false; }

  // 이 노드의 시각적 표현 — React 컴포넌트를 반환
  decorate(): React.ReactNode {
    return <CustomUI ast={this.__ast} />;
  }

  // JSON 직렬화 / 역직렬화 지원
  exportJSON(): SerializedASTDecoratorNode { ... }
  static importJSON(...): ASTDecoratorNode { ... }
}
```

`decorate()`가 반환하는 React 컴포넌트는 `createDOM()`이 만든 `<div>` 안에 **Portal** 방식으로 주입됩니다. Lexical DOM과 React DOM이 공존하는 핵심 지점입니다.

### 3단계 — 플러그인 (`src/plugins/`)

플러그인은 `useLexicalComposerContext()`로 editor 인스턴스에 접근하며, `editor.update()` 안에서만 EditorState를 변경할 수 있습니다.

**ExternalStatePlugin** — 외부 React state를 감시하여 변경 시 자동으로 Lexical 노드를 삽입합니다. 외부 시스템(API 응답, 폼 데이터 등)과 에디터를 연결하는 패턴입니다.

```ts
useEffect(() => {
  if (externalData) {
    editor.update(() => {
      const ast: ComponentAST = { /* 외부 데이터를 AST로 매핑 */ };
      const node = $createASTDecoratorNode(ast);
      $getRoot().append(node);
    });
  }
}, [editor, externalData]);
```

**InsertASTPlugin** — 툴바 버튼 클릭 시 AST 노드를 현재 커서 위치에 직접 삽입합니다.

**OnChangePlugin** — `editor.registerUpdateListener()`로 EditorState 변경을 구독하고, `editorState.toJSON()`으로 직렬화하여 부모 컴포넌트에 전달합니다.

### 4단계 — React UI (`src/components/CustomUI.tsx`)

`decorate()`를 통해 주입된 순수 React 컴포넌트입니다. AST의 `variant` 값에 따라 스타일이 분기됩니다. Lexical의 렌더링 주기와 독립적으로 React의 라이프사이클로 동작합니다.

```tsx
const CustomUI: React.FC<CustomUIProps> = ({ ast }) => {
  const config = VARIANT_CONFIG[ast.properties.variant];
  return (
    <div style={{ border: `2px solid ${config.border}`, ... }}>
      <header>{config.icon} {ast.properties.title}</header>
      <main>{ast.properties.content}</main>
    </div>
  );
};
```

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm exec vite
```

브라우저에서 `http://localhost:5173` 접속 후:

1. **Stage 1**: 제목과 타입을 수정한 뒤 **🚀 Pipeline 실행** 클릭 → 외부 state가 Lexical 노드로 주입됩니다.
2. **Stage 2**: 에디터 툴바의 삽입 버튼으로 노드를 직접 추가할 수도 있습니다.
3. **Stage 3**: 우측 하단에서 `EditorState`의 실시간 JSON을 확인합니다.
4. **Pipeline Tracer**: 좌측 사이드바에서 각 단계의 활성화 상태를 추적합니다.

---

## 주요 학습 포인트

**DecoratorNode의 역할** — Lexical 노드가 React 컴포넌트를 직접 소유하는 유일한 방법입니다. `createDOM()`이 만드는 껍데기 DOM과 `decorate()`가 반환하는 React 트리가 분리되어 있다는 점이 핵심입니다.

**`editor.update()` 필수 래핑** — Lexical의 EditorState는 불변(immutable)입니다. 모든 노드 삽입/수정은 반드시 `editor.update()` 콜백 내부에서 이루어져야 합니다.

**`updateDOM()` false 반환** — `decorate()`로 React가 DOM을 관리하는 경우, Lexical이 DOM을 직접 건드리지 않도록 `false`를 반환합니다. 두 렌더러의 책임을 명확히 분리하는 패턴입니다.

**직렬화 지원** — `importJSON` / `exportJSON`을 구현하면 에디터 내용을 JSON으로 저장하고 복원할 수 있습니다. AST 데이터가 포함된 노드도 완전히 직렬화됩니다.

**ExternalStatePlugin 패턴** — React의 `useEffect`로 외부 state를 감시하다가 `editor.update()`로 브리지하는 구조는, Lexical을 독립적인 상태 머신으로 유지하면서도 외부 데이터와 통합하는 권장 방식입니다.

---

## 관련 문서

- [`doc/PLAN.md`](doc/PLAN.md) — 구현 계획 및 체크리스트
- [`doc/GUIDE.md`](doc/GUIDE.md) — 상세 구현 가이드
- [`doc/LEARNING_GUIDE.md`](doc/LEARNING_GUIDE.md) — 학습 가이드
- [`doc/QUICK_START.md`](doc/QUICK_START.md) — 빠른 시작 가이드
- [Lexical 공식 문서](https://lexical.dev/docs/intro)
- [DecoratorNode API](https://lexical.dev/docs/concepts/nodes#decoratornode)
