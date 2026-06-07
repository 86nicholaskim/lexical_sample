# 🚀 React 개발자를 위한 Lexical 퀵 가이드

리액트(FE) 개발자가 Lexical을 처음 접할 때 "어디서부터 DOM을 건드려야 하지?"라는 막막함을 해결하기 위한 가이드입니다.

---

## 1. 멘탈 모델 전환 (React vs Lexical)

| 개념 | React | Lexical |
| :--- | :--- | :--- |
| **데이터** | State / Props (JSON) | **Editor State (AST)** |
| **렌더링 단위** | Component | **Node** |
| **화면 그리기** | JSX 반환 | **decorate()** (리액트 반환) |
| **명령/수정** | setState / Dispatch | **editor.update()** |

---

## 2. 실전 구현 3단계 (Quick Pattern)

### 1단계: 데이터 규격 정의 (Interface)
"이 컴포넌트에 어떤 정보가 필요한가?"를 먼저 생각하세요. 이것이 우리의 **AST**가 됩니다.
```typescript
interface MyUIProps {
  title: string;
  content: string;
}
```

### 2단계: 노드 만들기 (DecoratorNode)
리액트 개발자라면 `DecoratorNode`만 기억하면 됩니다. 여기가 **리액트와 에디터가 만나는 접점**입니다.
- **createDOM**: 에디터 내 위치를 잡기 위한 껍데기(DIV)를 만듭니다. (1번만 실행)
- **decorate**: 우리가 잘 아는 **리액트 컴포넌트를 반환**하는 곳입니다.

### 3단계: 플러그인으로 조작하기 (Plugin)
에디터에 내 UI를 "넣거나 빼는" 로직은 플러그인에 작성합니다.
```typescript
editor.update(() => {
  const node = $createMyNode(data); // 노드 생성
  $insertNodes([node]);             // 에디터에 삽입
});
```

---

## 3. 리액트 개발자가 가장 많이 묻는 질문 (FAQ)

### Q. 에디터 안에서 버튼 클릭 이벤트를 달고 싶어요.
A. `decorate()`에서 반환하는 리액트 컴포넌트 안에 평소처럼 `onClick`을 작성하세요. 에디터가 아닌 리액트가 이벤트를 처리합니다.

### Q. 외부 API 데이터를 에디터에 보여주고 싶어요.
A. 외부 데이터를 가져온 뒤, `editor.update()`를 실행하여 노드를 삽입하는 **플러그인**을 만드세요.

---

## 4. 꿀팁 (Cheat Sheet)
- **노드 찾기**: `editor.getEditorState().read(() => ...)`
- **강제 업데이트**: 노드 내부 데이터가 바뀌었는데 화면이 안 변하면 `node.getWritable()`을 통해 데이터를 갱신하세요.
