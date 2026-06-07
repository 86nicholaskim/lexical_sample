export interface ComponentAST {
  type: 'info-card' | 'alert' | 'status';
  properties: {
    title: string;
    content: string;
    variant?: 'success' | 'warning' | 'error' | 'info';
  };
}
