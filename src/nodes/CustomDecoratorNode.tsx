import { DecoratorNode, NodeKey, LexicalNode, SerializedLexicalNode, Spread } from 'lexical';
import * as React from 'react';

export type SerializedCustomDecoratorNode = Spread<
  {
    text: string;
  },
  SerializedLexicalNode
>;

export class CustomDecoratorNode extends DecoratorNode<React.ReactNode> {
  __text: string;

  static getType(): string {
    return 'custom-decorator';
  }

  static clone(node: CustomDecoratorNode): CustomDecoratorNode {
    return new CustomDecoratorNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedCustomDecoratorNode): CustomDecoratorNode {
    const node = $createCustomDecoratorNode(serializedNode.text);
    return node;
  }

  exportJSON(): SerializedCustomDecoratorNode {
    return {
      ...super.exportJSON(),
      text: this.__text,
      type: 'custom-decorator',
      version: 1,
    };
  }

  getText(): string {
    return this.__text;
  }

  decorate(): React.ReactNode {
    return (
      <div className="decorator-container">
        <strong>리액트 컴포넌트 데코레이터:</strong> {this.__text}
      </div>
    );
  }
}

export function $createCustomDecoratorNode(text: string): CustomDecoratorNode {
  return new CustomDecoratorNode(text);
}

export function $isCustomDecoratorNode(
  node: LexicalNode | null | undefined,
): node is CustomDecoratorNode {
  return node instanceof CustomDecoratorNode;
}
