export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read';
  const cleanContent = content.replace(/```[\s\S]*?```/g, '').replace(/[#*`_\[\]()]/g, '');
  const wordCount = cleanContent.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
}
