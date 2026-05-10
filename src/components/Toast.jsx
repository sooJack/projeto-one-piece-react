import React from 'react';

export default function Toast({ toasts }) {
  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem',
      zIndex: 2000, display: 'flex', flexDirection: 'column', gap: '0.5rem',
    }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={{
          background: 'var(--black-card)',
          border: `1px solid ${toast.type === 'success' ? '#2ecc71' : toast.type === 'error' ? 'var(--red-bright)' : 'var(--gold)'}`,
          borderRadius: 4,
          padding: '0.75rem 1.2rem',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          color: 'var(--white)',
          animation: 'fadeInUp 0.3s ease',
          maxWidth: 320,
          boxShadow: toast.type === 'success'
            ? '0 0 20px rgba(46,204,113,0.2)'
            : toast.type === 'error'
            ? '0 0 20px rgba(204,34,0,0.3)'
            : '0 0 20px rgba(200,168,75,0.1)',
        }}>
          {toast.type === 'success' && '✅ '}
          {toast.type === 'error' && '❌ '}
          {toast.type === 'default' && '⚓ '}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
