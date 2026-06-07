import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { $createASTDecoratorNode } from '../nodes/ASTDecoratorNode';
import { ComponentAST } from '../types/ast';

export function InsertASTPlugin() {
  const [editor] = useLexicalComposerContext();

  const insertAST = (type: ComponentAST['type'], variant: 'info' | 'alert' | 'success') => {
    editor.update(() => {
      const ast: ComponentAST = {
        type,
        properties: {
          title: `신규 ${type} UI`,
          content: `${variant} 스타일로 생성된 커스텀 컴포넌트입니다.`,
          variant,
        },
      };
      const node = $createASTDecoratorNode(ast);
      $insertNodes([node]);
    });
  };

  return (
    <div className="insert-ast-toolbar" style={{ padding: '10px', backgroundColor: '#fdfdfd', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '5px' }}>
      <button onClick={() => insertAST('info-card', 'info')}>Info UI 삽입</button>
      <button onClick={() => insertAST('alert', 'alert')}>Alert UI 삽입</button>
      <button onClick={() => insertAST('status', 'success')}>Success UI 삽입</button>
    </div>
  );
}
