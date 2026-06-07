# Lexical AST 매핑 및 활용 가이드

이 가이드는 외부 객체(JSON) 데이터를 어떻게 Lexical의 AST 구조로 변환하고, 이를 리액트 컴포넌트로 에디터 내에 렌더링(Decorator)하는지 설명합니다.

## 1. 데이터 흐름 개요
`외부 객체` -> `ComponentAST 인터페이스 변환` -> `ASTDecoratorNode 생성` -> `Lexical 에디터 삽입` -> `React Decorate 렌더링`

## 2. AST 구조 (`src/types/ast.ts`)
모든 외부 데이터는 에디터에 들어가기 전 아래의 인터페이스 형식을 갖춰야 합니다.

```typescript
export interface ComponentAST {
  type: 'info-card' | 'alert' | 'status';
  properties: {
    title: string;
    content: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
}
```

## 3. 외부 객체 변환 예시
외부에서 받아온 raw 데이터를 AST 형식으로 매핑하는 함수 예시입니다.

```typescript
function mapExternalToAST(externalData: any): ComponentAST {
  return {
    type: externalData.kind === 'notification' ? 'alert' : 'info-card',
    properties: {
      title: externalData.subject || '제목 없음',
      content: externalData.body || '',
      variant: externalData.priority === 'high' ? 'error' : 'info'
    }
  };
}
```

## 4. Lexical 노드로 삽입
변환된 AST 객체를 `$createASTDecoratorNode(ast)`를 사용하여 에디터에 삽입합니다.

```typescript
editor.update(() => {
  const ast = mapExternalToAST(apiResponse);
  const node = $createASTDecoratorNode(ast);
  $insertNodes([node]);
});
```

## 5. 리액트 활용 (Decorator)
`ASTDecoratorNode.tsx`의 `decorate()` 메서드는 이 AST 데이터를 기반으로 순수 리액트 컴포넌트를 반환합니다. 이 과정에서 에디터의 텍스트 흐름 내에 복잡한 UI(차트, 폼, 카드 등)를 안전하게 삽입할 수 있습니다.

## 6. 테스트 방법
현재 앱의 상단 버튼들은 이 로직을 시뮬레이션하고 있습니다. 버튼 클릭 시 특정 형태의 AST가 생성되어 에디터에 즉시 반영되는 것을 확인할 수 있습니다.
