import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export function OnChangePlugin({ onChange }: { onChange?: (editorState: string) => void }) {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange?.(JSON.stringify(editorState.toJSON()));
    });
  }, [editor, onChange]);

  return null;
}
