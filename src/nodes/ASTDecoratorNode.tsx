import { DecoratorNode, NodeKey, LexicalNode, SerializedLexicalNode, Spread } from 'lexical';
import * as React from 'react';
import { ComponentAST } from '../types/ast';
import { CustomUI } from '../components/CustomUI';

/**
 * 1. 데이터 규격 정의 (Serialization Type)
 * Lexical이 상태를 JSON으로 저장하거나 불러올 때 사용할 데이터 형식을 정의합니다.
 */
export type SerializedASTDecoratorNode = Spread<
  {
    ast: ComponentAST;
  },
  SerializedLexicalNode
>;

/**
 * 2. ASTDecoratorNode 클래스
 * 이 클래스는 AST 데이터를 에디터 내부의 하나의 '노드'로 관리하는 핵심 로직입니다.
 */
export class ASTDecoratorNode extends DecoratorNode<React.ReactNode> {
  __ast: ComponentAST; // 노드가 보유할 실제 데이터 (AST)

  static getType(): string {
    return 'ast-decorator';
  }

  static clone(node: ASTDecoratorNode): ASTDecoratorNode {
    return new ASTDecoratorNode(node.__ast, node.__key);
  }

  constructor(ast: ComponentAST, key?: NodeKey) {
    super(key);
    this.__ast = ast;
  }

  /**
   * [중요] 3. createDOM
   * 에디터 엔진이 노드를 DOM 트리 상에 배치하기 위해 호출합니다.
   * 여기서는 리액트가 렌더링될 '바깥 껍데기(Wrapper)'만 만듭니다.
   */
  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'block'; // 한 줄을 차지하도록 설정
    return div;
  }

  updateDOM(): false {
    // 내부 리액트 컴포넌트의 업데이트는 리액트가 담당하므로 
    // Lexical의 직접적인 DOM 업데이트는 필요하지 않습니다.
    return false;
  }

  /**
   * 4. 직렬화 (JSON 저장/로드)
   */
  static importJSON(serializedNode: SerializedASTDecoratorNode): ASTDecoratorNode {
    const node = $createASTDecoratorNode(serializedNode.ast);
    return node;
  }

  exportJSON(): SerializedASTDecoratorNode {
    return {
      ...super.exportJSON(),
      ast: this.__ast,
      type: 'ast-decorator',
      version: 1,
    };
  }

  /**
   * [중요] 5. decorate
   * 실제 사용자에게 보여질 시각적 요소를 리액트 컴포넌트로 반환합니다.
   * createDOM에서 만든 DIV 안에 이 컴포넌트가 렌더링됩니다.
   */
  decorate(): React.ReactNode {
    return <CustomUI ast={this.__ast} />;
  }
}

/**
 * 노드 생성을 위한 Helper 함수
 */
export function $createASTDecoratorNode(ast: ComponentAST): ASTDecoratorNode {
  return new ASTDecoratorNode(ast);
}

/**
 * 특정 노드가 ASTDecoratorNode인지 확인하는 Type Guard
 */
export function $isASTDecoratorNode(
  node: LexicalNode | null | undefined,
): node is ASTDecoratorNode {
  return node instanceof ASTDecoratorNode;
}
