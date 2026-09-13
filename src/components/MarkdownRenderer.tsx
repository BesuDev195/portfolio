'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import { Check, Copy } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// OWASP A03 / Anti-XSS: Strict sanitization schema
// Strips <script>, <iframe>, <object>, inline event handlers like onerror/onload, and javascript: URLs
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), 'className'],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
    pre: [...(defaultSchema.attributes?.pre || []), 'className'],
    h1: ['id'],
    h2: ['id'],
    h3: ['id'],
    h4: ['id'],
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    th: ['align'],
    td: ['align'],
  },
};

function CodeBlock({ className, children, ...props }: React.ComponentPropsWithoutRef<'code'>) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const isInline = !className && typeof children === 'string' && !children.includes('\n');

  if (isInline) {
    return (
      <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-200 dark:border-zinc-700/60" {...props}>
        {children}
      </code>
    );
  }

  const codeString = String(children).replace(/\n$/, '');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d1117]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900/90 text-xs font-mono text-zinc-400">
        <span className="uppercase tracking-wider font-medium text-zinc-300">
          {language || 'code'}
        </span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          title="Copy code"
          type="button"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-zinc-100 font-mono">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeSanitize, sanitizeSchema],
          [rehypeHighlight, { ignoreMissing: true }],
        ]}
        components={{
          h1: ({ children }) => {
            const text = String(children);
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h1 id={id} className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-10 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = String(children);
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h2 id={id} className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-10 mb-4">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            return (
              <h3 id={id} className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-3">
                {children}
              </h3>
            );
          },
          p: ({ children }) => (
            <p className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 my-4">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-zinc-700 dark:text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-zinc-700 dark:text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-1">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-zinc-900 dark:border-zinc-400 pl-5 italic my-6 text-zinc-600 dark:text-zinc-400 font-serif text-lg">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-10 border-zinc-200 dark:border-zinc-800" />
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-left">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-zinc-100 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-200 font-semibold uppercase tracking-wider text-xs">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-xs tracking-wider uppercase text-zinc-900 dark:text-zinc-100">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300 border-t border-zinc-200/60 dark:border-zinc-800/60 font-mono text-xs sm:text-sm">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-zinc-900 dark:text-zinc-100 underline underline-offset-4 decoration-zinc-400 dark:decoration-zinc-600 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <span className="block my-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt || ''}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm"
              />
              {alt && (
                <span className="block text-center text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-mono">
                  {alt}
                </span>
              )}
            </span>
          ),
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
