export const pageStyle = {
  minHeight: '100vh',
  background: '#0a0a0a',
  padding: '16px',
};

export const inputStyle = {
  width: '100%',
  background: '#0d0d0d',
  border: '1px solid #1e1e1e',
  color: '#e8e8e8',
  padding: '11px 14px',
  fontSize: '12px',
  fontFamily: 'Roboto Mono, monospace',
  letterSpacing: '1px',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

export const selectStyle = {
  ...inputStyle as object,
  cursor: 'pointer',
  appearance: 'none' as const,
  WebkitAppearance: 'none' as const,
};

export const labelStyle = {
  color: '#333',
  fontSize: '9px',
  letterSpacing: '2px',
  marginBottom: '6px',
  display: 'block' as const,
};

export const sectionStyle = {
  background: '#0a0a0a',
  border: '1px solid #1e1e1e',
  padding: '24px',
  marginBottom: '1px',
};

export const sectionTitleStyle = {
  color: '#333',
  fontSize: '9px',
  letterSpacing: '3px',
  marginBottom: '20px',
  paddingBottom: '10px',
  borderBottom: '1px solid #1a1a1a',
  display: 'block' as const,
};

export const gridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
};

export const submitStyle = {
  width: '100%',
  background: '#00ff88',
  color: '#000',
  border: 'none',
  padding: '14px',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '3px',
  cursor: 'pointer',
  fontFamily: 'Roboto Mono, monospace',
  marginTop: '1px',
};

export const submitLoadingStyle = {
  ...submitStyle,
  background: '#111',
  color: '#333',
  cursor: 'not-allowed',
};