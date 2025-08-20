export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return ''
  
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.75rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">$1</h1>')
    
    // Text formatting
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="font-weight: 600;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="font-style: italic;">$1</em>')
    
    // Lists
    .replace(/^\* (.*$)/gim, '<li style="margin-bottom: 0.25rem;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 0.25rem;">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li style="margin-bottom: 0.25rem;">$1</li>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #1976d2; text-decoration: underline;" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Line breaks and paragraphs
    .replace(/\n\n/gim, '</p><p style="margin-bottom: 1rem; line-height: 1.7;">')
    .replace(/\n/gim, '<br />')
    
    // Wrap in paragraph tags
    .replace(/^(.+)/, '<p style="margin-bottom: 1rem; line-height: 1.7;">$1</p>')
}