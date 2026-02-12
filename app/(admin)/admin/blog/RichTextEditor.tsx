'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md flex items-center justify-center bg-gray-50">
      <span className="text-gray-400">Cargando editor...</span>
    </div>
  ),
});

import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'list',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Escribe el contenido del artículo..."
        className="h-96"
      />
      <style jsx global>{`
        .rich-text-editor .ql-container {
          font-size: 16px;
          font-family: inherit;
        }
        .rich-text-editor .ql-editor {
          min-height: 300px;
          line-height: 1.6;
        }
        .rich-text-editor .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ql-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin-bottom: 0.5em;
        }
        .rich-text-editor .ql-editor p {
          margin-bottom: 1em;
        }
        .rich-text-editor .ql-editor blockquote {
          border-left: 4px solid #ccc;
          padding-left: 16px;
          margin: 1em 0;
          font-style: italic;
        }
        .rich-text-editor .ql-editor pre.ql-syntax {
          background-color: #23241f;
          color: #f8f8f2;
          overflow: auto;
          padding: 1em;
          border-radius: 4px;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        .rich-text-editor .ql-editor a {
          color: #ca8a04;
          text-decoration: underline;
        }
        .rich-text-editor .ql-editor ul,
        .rich-text-editor .ql-editor ol {
          padding-left: 1.5em;
          margin-bottom: 1em;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          background: #f9fafb;
        }
        .rich-text-editor .ql-container {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
        }
      `}</style>
    </div>
  );
}
