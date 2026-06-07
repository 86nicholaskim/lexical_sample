import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $getRoot, $createParagraphNode } from 'lexical';
import { useEffect } from 'react';
import { $createASTDecoratorNode } from '../nodes/ASTDecoratorNode';
import { ComponentAST } from '../types/ast';

interface ExternalStatePluginProps {
  externalData?: {
    key: string;
    value: {
      type: 'info-card' | 'alert' | 'status';
      properties: {
        title: string;
        content: string;
        variant: string;
      };
    };
  } | null;
}

/**
 * [학습용] 신규 플러그인: ExternalStatePlugin
 * 이 플러그인은 외부 상태(React State 등)를 감시하다가 
 * 특정 조건이 맞으면 Lexical AST 노드로 변환하여 에디터에 자동 주입하는 패턴을 보여줍니다.
 */
export function ExternalStatePlugin({ externalData }: ExternalStatePluginProps): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (externalData) {
      editor.update(() => {
        // 1. 외부 데이터를 AST 규격으로 변환 (Mapping)
        const ast: ComponentAST = {
          type: externalData.value.type,
          properties: {
            title: `[ID: ${externalData.key}] ${externalData.value.properties.title}`,
            content: externalData.value.properties.content,
            variant: externalData.value.properties.variant as any
          }
        };

        // 2. AST를 보유한 Lexical 노드 생성
        const node = $createASTDecoratorNode(ast);

        // 3. 에디터 마지막에 삽입
        const root = $getRoot();
        root.append(node);
        
        // 가독성을 위해 빈 문단 하나 추가
        root.append($createParagraphNode());
      });
    }
  }, [editor, externalData]);

  return null;
}
