import { useState } from 'react';
import Editor from './Editor';
import { PipelineTracer } from './components/PipelineTracer';

function App() {
  const [editorState, setEditorState] = useState('');
  const [rawInput, setRawInput] = useState({
    type: 'alert' as const,
    properties: {
      title: '서버 에러 발생!',
      content: '네트워크 연결 상태를 확인해주세요.',
      variant: 'alert' as const
    }
  });

  const [pushedData, setPushedData] = useState<any>(null);

  const pipeline = [
    {
      step: '1. Raw Data',
      desc: '초기 렌더링 시 기본값이 설정되며, 사용자가 입력값을 바꾸면 React State가 즉시 업데이트됩니다.',
      file: 'External State',
      code: JSON.stringify(rawInput, null, 2),
      active: true
    },
    {
      step: '2. AST Interface',
      desc: '상태 변경 시 데이터가 규격을 따르는지 검증합니다. 에디터 삽입 전 최종 데이터 검문소 역할을 합니다.',
      file: 'src/types/ast.ts',
      code: `export interface ComponentAST {
  type: '\${rawInput.type}';
  properties: { title: string; ... };
}`,
      active: true
    },
    {
      step: '3. Lexical Node',
      desc: '실행 버튼 클릭 시 editor.update()가 호출되어, 신규 노드가 Lexical의 EditorState 트리에 등록됩니다.',
      file: 'src/nodes/ASTDecoratorNode.tsx',
      code: `// editor.update(() => {
const node = $createASTDecoratorNode(ast);
$getRoot().append(node);
// });`,
      active: !!pushedData
    },
    {
      step: '4. Decorate Bridge',
      desc: 'Lexical 렌더링 주기에서 decorate()가 실행되며, 에디터 내부에 리액트 컴포넌트를 위한 포털을 생성합니다.',
      file: 'src/nodes/ASTDecoratorNode.tsx',
      code: `decorate(): React.ReactNode {
  return <CustomUI ast={this.__ast} />;
}`,
      active: !!pushedData
    },
    {
      step: '5. React View',
      desc: '주입된 컴포넌트는 Props(AST)를 전달받아 리액트 라이프사이클에 따라 최종 화면을 동기화합니다.',
      file: 'src/components/CustomUI.tsx',
      code: `const CustomUI = ({ ast }) => {
  return <div className={ast.type}>...</div>
}`,
      active: !!pushedData
    }
  ];

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'info-card' | 'alert' | 'status';
    const variantMap: Record<string, 'info' | 'alert' | 'success'> = {
      'info-card': 'info',
      'alert': 'alert',
      'status': 'success'
    };
    setRawInput({
      ...rawInput, 
      type: val, 
      properties: {
        ...rawInput.properties, 
        variant: variantMap[val]
      }
    });
  };

  return (
    <div className="app-wrapper">
      <PipelineTracer pipeline={pipeline} />

      <div className="main-dashboard">
        {/* Stage 1: Data Input */}
        <div className="stage-card">
          <h3 style={{ marginTop: 0, color: '#2d3748' }}>Stage 1: Modify Data Object</h3>
          <p style={{ fontSize: '14px', color: '#718096' }}>왼쪽의 JSON 구조를 마음대로 수정해 보세요.</p>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Title:</label>
              <input 
                value={rawInput.properties.title} 
                onChange={(e) => setRawInput({...rawInput, properties: {...rawInput.properties, title: e.target.value}})}
                style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd' }}
              />
            </div>
            <div style={{ width: '150px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Type:</label>
              <select 
                value={rawInput.type} 
                onChange={handleTypeChange}
                style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="info-card">info-card</option>
                <option value="alert">alert</option>
                <option value="status">status</option>
              </select>
            </div>
            <button 
              onClick={() => setPushedData({ key: Date.now().toString(), value: rawInput })}
              style={{ alignSelf: 'flex-end', padding: '10px 25px', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              🚀 Pipeline 실행
            </button>
          </div>
        </div>

        {/* Stage 2: Editor Sandbox */}
        <div className="stage-card">
          <h3 style={{ marginTop: 0, color: '#2d3748' }}>Stage 2: Result Sandbox</h3>
          <Editor externalData={pushedData} onChange={setEditorState} />
        </div>

        {/* Stage 3: JSON Analyzer */}
        <div className="json-analyzer">
          <div style={{ color: '#63b3ed', fontWeight: 'bold', marginBottom: '15px', fontSize: '0.9em' }}>
            Stage 3: Resulting AST JSON (Editor Internal State)
          </div>
          <pre style={{ margin: 0, color: '#e2e8f0', fontSize: '13px', overflowY: 'auto', flex: 1, fontFamily: 'Fira Code, monospace' }}>
            {editorState ? JSON.stringify(JSON.parse(editorState), null, 2) : '// 에디터 데이터가 실시간으로 분석됩니다.'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
