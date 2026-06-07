import { DecoratorNode, NodeKey, LexicalNode, SerializedLexicalNode, Spread } from 'lexical';
import * as React from 'react';
import { ComponentAST } from '../types/ast';

export type SerializedASTDecoratorNode = Spread<
  {
    ast: ComponentAST;
  },
  SerializedLexicalNode
>;

export class ASTDecoratorNode extends DecoratorNode<React.ReactNode> {
  __ast: ComponentAST;

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

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'block';
    return div;
  }

  updateDOM(): false {
    return false;
  }

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

  getAST(): ComponentAST {
    return this.__ast;
  }

  decorate(): React.ReactNode {
    const { type, properties } = this.__ast;
    
    const style: React.CSSProperties = {
      padding: '15px',
      margin: '10px 0',
      borderRadius: '8px',
      border: '1px solid #ddd',
      backgroundColor: properties.variant === 'warning' ? '#fff3cd' : 
                       properties.variant === 'error' ? '#f8d7da' : 
                       properties.variant === 'success' ? '#d4edda' : '#e2e3e5',
      color: properties.variant === 'warning' ? '#856404' : 
             properties.variant === 'error' ? '#721c24' : 
             properties.variant === 'success' ? '#155724' : '#383d41',
    };

    return (
      <div style={style}>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          [{type.toUpperCase()}] {properties.title}
        </div>
        <div>{properties.content}</div>
      </div>
    );
  }
}

export function $createASTDecoratorNode(ast: ComponentAST): ASTDecoratorNode {
  return new ASTDecoratorNode(ast);
}

export function $isASTDecoratorNode(
  node: LexicalNode | null | undefined,
): node is ASTDecoratorNode {
  return node instanceof ASTDecoratorNode;
}
