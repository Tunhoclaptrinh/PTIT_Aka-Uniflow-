import React from 'react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser }) => {
  if (!content) return null;

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div
      style={{
        lineHeight: 1.65,
        fontSize: 13.5,
        color: isUser ? '#FFFFFF' : '#1F2937',
      }}
    >
      {parts.map((part, pIdx) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const codeContent = part.replace(/^```[a-z]*\n?/, '').replace(/```$/, '');
          return (
            <pre
              key={pIdx}
              style={{
                background: isUser ? 'rgba(0,0,0,0.2)' : '#1E293B',
                color: isUser ? '#FFFFFF' : '#E2E8F0',
                padding: '8px 12px',
                borderRadius: 6,
                fontSize: 12,
                fontFamily: 'Consolas, Monaco, monospace',
                overflowX: 'auto',
                margin: '8px 0',
              }}
            >
              <code>{codeContent}</code>
            </pre>
          );
        }

        // Parse regular lines
        const lines = part.split('\n');
        return (
          <React.Fragment key={pIdx}>
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();

              // Empty line = spacer
              if (!trimmed) {
                return <div key={lIdx} style={{ height: 6 }} />;
              }

              // Headers
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} style={{ margin: '8px 0 4px', fontSize: 14, fontWeight: 700, color: isUser ? '#FFFFFF' : '#111827' }}>
                    {renderInlineMarkdown(trimmed.replace(/^### /, ''), isUser)}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} style={{ margin: '10px 0 4px', fontSize: 15, fontWeight: 700, color: isUser ? '#FFFFFF' : '#111827' }}>
                    {renderInlineMarkdown(trimmed.replace(/^## /, ''), isUser)}
                  </h3>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lIdx} style={{ display: 'flex', gap: 6, margin: '2px 0 2px 8px' }}>
                    <span style={{ color: isUser ? '#FFFFFF' : '#ed1c24', fontWeight: 700 }}>•</span>
                    <span>{renderInlineMarkdown(trimmed.replace(/^[-*] /, ''), isUser)}</span>
                  </div>
                );
              }

              // Numbered list
              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lIdx} style={{ display: 'flex', gap: 6, margin: '2px 0 2px 8px' }}>
                    <span style={{ color: isUser ? '#FFFFFF' : '#ed1c24', fontWeight: 700 }}>{numMatch[1]}.</span>
                    <span>{renderInlineMarkdown(numMatch[2], isUser)}</span>
                  </div>
                );
              }

              // Blockquotes
              if (trimmed.startsWith('> ')) {
                return (
                  <div
                    key={lIdx}
                    style={{
                      borderLeft: isUser ? '3px solid rgba(255,255,255,0.6)' : '3px solid #ed1c24',
                      paddingLeft: 10,
                      margin: '6px 0',
                      fontStyle: 'italic',
                      color: isUser ? 'rgba(255,255,255,0.9)' : '#4B5563',
                    }}
                  >
                    {renderInlineMarkdown(trimmed.replace(/^> /, ''), isUser)}
                  </div>
                );
              }

              // Normal text
              return (
                <p key={lIdx} style={{ margin: '2px 0' }}>
                  {renderInlineMarkdown(line, isUser)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Inline helper to parse bold, italic, inline code, and links
function renderInlineMarkdown(text: string, isUser?: boolean): React.ReactNode {
  if (!text) return '';

  // Tokenize regex for **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} style={{ fontWeight: 700, color: isUser ? '#FFFFFF' : '#111827' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={idx}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          style={{
            background: isUser ? 'rgba(0,0,0,0.18)' : '#F3F4F6',
            color: isUser ? '#FFFFFF' : '#ed1c24',
            padding: '1px 5px',
            borderRadius: 4,
            fontSize: 12,
            fontFamily: 'Consolas, Monaco, monospace',
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={idx}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isUser ? '#FFFFFF' : '#2563EB',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
        >
          {linkMatch[1]}
        </a>
      );
    }
    return part;
  });
}

export default MarkdownRenderer;
