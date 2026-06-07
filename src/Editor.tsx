import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { ASTDecoratorNode } from './nodes/ASTDecoratorNode';
import { ExternalStatePlugin } from './plugins/ExternalStatePlugin';
import { OnChangePlugin } from './plugins/OnChangePlugin';
import { InsertASTPlugin } from './plugins/InsertASTPlugin';

const theme = {};

interface EditorProps {
  initialContent?: string;
  onChange?: (editorState: string) => void;
  externalData?: any;
}

/**
 * [Toolbar] 기본적인 텍스트 스타일링 도구
 */
function Toolbar() {
  return (
    <div className="toolbar">
      <button title="Bold"><b>B</b></button>
      <button title="Italic"><i>I</i></button>
      <button title="Underline"><u>U</u></button>
      <div style={{ width: '1px', background: '#e2e8f0', margin: '0 4px' }} />
    </div>
  );
}

/**
 * [Editor] Lexical 설정 및 플러그인 구성의 진입점
 */
export default function Editor({ initialContent, onChange, externalData }: EditorProps) {
  const initialConfig = {
    namespace: 'ASTEditor',
    theme,
    nodes: [ASTDecoratorNode],
    onError: (error: Error) => console.error(error),
    editorState: initialContent,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-shell">
        <Toolbar />
        <InsertASTPlugin />
        
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">내용을 입력하세요...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
          <ExternalStatePlugin externalData={externalData} />
        </div>
      </div>
    </LexicalComposer>
  );
}
