import React from 'react';
import { ComponentAST } from '../types/ast';

/**
 * [UI Component]
 * Lexical 노드로부터 AST 데이터를 전달받아 화면을 그리는 순수 리액트 영역입니다.
 */
interface CustomUIProps {
  ast: ComponentAST;
}

const VARIANT_CONFIG = {
  success: { border: '#48bb78', bg: '#f0fff4', icon: '✅' },
  alert: { border: '#f56565', bg: '#fff5f5', icon: '🚨' },
  info: { border: '#4299e1', bg: '#ebf8ff', icon: 'ℹ️' },
};

export const CustomUI: React.FC<CustomUIProps> = ({ ast }) => {
  const { type, properties } = ast;
  const config = VARIANT_CONFIG[properties.variant as keyof typeof VARIANT_CONFIG] || VARIANT_CONFIG.info;

  return (
    <div className={`custom-ui-card variant-${properties.variant || 'info'}`} style={{
      border: `2px solid ${config.border}`,
      backgroundColor: config.bg,
      padding: '20px',
      borderRadius: '12px',
      margin: '10px 0',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      userSelect: 'none'
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ fontSize: '1.5em' }}>{config.icon}</span>
        <strong style={{ fontSize: '1.1em' }}>{properties.title}</strong>
      </header>
      
      <main style={{ color: '#4a5568', lineHeight: '1.5' }}>
        {properties.content}
      </main>
      
      <footer style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #ddd', fontSize: '0.8em', color: '#a0aec0' }}>
        Rendered by React Component (AST Type: {type})
      </footer>
    </div>
  );
};
