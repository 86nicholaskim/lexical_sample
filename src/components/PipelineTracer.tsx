import { ComponentAST } from '../types/ast';

interface PipelineItem {
  step: string;
  desc: string;
  file: string;
  code: string;
  active: boolean;
}

const Arrow = () => (
  <div className="pipeline-arrow" style={{ display: 'flex', justifyContent: 'center', padding: '10px 0', color: '#cbd5e0', fontSize: '20px' }}>
    ⬇️
  </div>
);

export const PipelineTracer = ({ pipeline }: { pipeline: PipelineItem[] }) => {
  return (
    <div className="pipeline-sidebar">
      <h2 style={{ fontSize: '1.5em', color: '#2d3748', marginBottom: '10px', borderBottom: '3px solid #3182ce', paddingBottom: '10px' }}>
        Lexical Pipeline Tracer
      </h2>
      <p style={{ fontSize: '14px', color: '#718096', marginBottom: '30px' }}>
        데이터가 화면에 그려지기까지의 전 과정을 실시간으로 추적합니다.
      </p>

      {pipeline.map((item, idx) => (
        <div key={item.step}>
          <div className={`pipeline-item \${item.active ? 'active' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong style={{ color: item.active ? '#2b6cb0' : '#718096' }}>{item.step}</strong>
              <code style={{ fontSize: '11px', color: '#a0aec0' }}>{item.file}</code>
            </div>
            <p style={{ fontSize: '12px', color: '#4a5568', margin: '0 0 10px 0' }}>{item.desc}</p>
            <pre className="pipeline-code">
              {item.code}
            </pre>
          </div>
          {idx < pipeline.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  );
};
