'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Detectar si el contenido parece ser markdown o HTML
 * - Si contiene tags HTML comunes → es HTML
 * - Si contiene sintaxis markdown (# headers, | tables, - lists) → es markdown
 */
function isLikelyMarkdown(content: string): boolean {
  // Si contiene tags HTML comunes, probablemente es HTML del editor
  if (/<(p|div|h[1-6]|ul|ol|table|br|strong|em)\b/i.test(content)) {
    return false;
  }
  // Si contiene sintaxis markdown común, es markdown
  if (/^#{1,6}\s|^\s*[-*+]\s|\|.+\|/m.test(content)) {
    return true;
  }
  // Por defecto, tratar como markdown si no tiene HTML
  return !/<[^>]+>/.test(content);
}

/**
 * Componente que renderiza contenido de blog
 * Detecta automáticamente si es markdown o HTML y renderiza apropiadamente
 */
export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) {
    return null;
  }

  const proseClasses = `prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-luxus-dark prose-p:text-luxus-gray prose-a:text-luxus-gold prose-strong:text-luxus-dark break-words ${className}`;

  if (isLikelyMarkdown(content)) {
    return (
      <div className={proseClasses} style={{ overflowWrap: 'anywhere' }}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  // Es HTML, renderizar directamente
  return (
    <div
      className={proseClasses}
      style={{ overflowWrap: 'anywhere' }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

/**
 * Limpia el markdown/HTML del texto para mostrar solo texto plano
 * Útil para excerpts en tarjetas
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';

  return text
    // Remover headers markdown
    .replace(/^#{1,6}\s+/gm, '')
    // Remover negrita/cursiva markdown
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remover links markdown [texto](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remover imágenes markdown ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remover tablas markdown (líneas con |)
    .replace(/\|[^|\n]+\|/g, ' ')
    .replace(/\|[-:]+\|/g, '')
    // Remover listas markdown
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remover código inline
    .replace(/`([^`]+)`/g, '$1')
    // Remover blockquotes
    .replace(/^>\s*/gm, '')
    // Remover tags HTML
    .replace(/<[^>]+>/g, '')
    // Limpiar espacios múltiples
    .replace(/\s+/g, ' ')
    .trim();
}

export default MarkdownContent;
