import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes } from 'lexical';
import { useEffect } from 'react';
import { ASTDecoratorNode, $createASTDecoratorNode } from './nodes/ASTDecoratorNode';
import { ComponentAST } from './types/ast';

const theme = {};

function InsertASTPlugin() {
  const [editor] = useLexicalComposerContext();

  const insertAST = (type: ComponentAST['type'], variant: ComponentAST['properties']['variant']) => {
    editor.update(() => {
      const ast: ComponentAST = {
        type,
        properties: {
          title: `${type} 컴포넌트`,
          content: `${variant} 스타일의 AST 노드입니다.`,
          variant,
        },
      };
      const node = $createASTDecoratorNode(ast);
      $insertNodes([node]);
    });
  };

  return (
    <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
      <button onClick={() => insertAST('info-card', 'info')}>Info Card</button>
      <button onClick={() => insertAST('alert', 'error')}>Alert (Error)</button>
      <button onClick={() => insertAST('status', 'success')}>Status (Success)</button>
    </div>
  );
}

interface EditorProps {
  initialContent?: string;
  onChange?: (editorState: string) => void;
}

function OnChangePlugin({ onChange }: { onChange?: (editorState: string) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange?.(JSON.stringify(editorState.toJSON()));
    });
  }, [editor, onChange]);
  return null;
}

export default function Editor({ initialContent, onChange }: EditorProps) {
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
        <InsertASTPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">AST 노드를 삽입해보세요...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}
