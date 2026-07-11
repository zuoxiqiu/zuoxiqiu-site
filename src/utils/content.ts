const markdownNoise = [
  /```[\s\S]*?```/g,
  /!\[[^\]]*\]\([^)]*\)/g,
  /<[^>]+>/g,
];

export const plainTextFromMarkdown = (body = '') => {
  let text = body;

  for (const pattern of markdownNoise) {
    text = text.replace(pattern, ' ');
  }

  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*(?:---|\*\*\*|___)\s*$/gm, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[\\`*_~|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getExcerpt = (body = '', limit = 96) => {
  const text = plainTextFromMarkdown(body);
  const characters = Array.from(text);

  if (characters.length <= limit) return text;

  const draft = characters.slice(0, limit).join('');
  const sentenceEnd = Math.max(
    draft.lastIndexOf('。'),
    draft.lastIndexOf('！'),
    draft.lastIndexOf('？')
  );

  if (sentenceEnd >= Math.max(28, Math.floor(limit * 0.35))) {
    return draft.slice(0, sentenceEnd + 1);
  }

  return `${draft.replace(/[，、；：,.!?\s]+$/u, '')}…`;
};

export const getReadingMinutes = (body = '') => {
  const text = plainTextFromMarkdown(body);
  const cjkCount = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinCount = (
    text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9'-]+/g) ?? []
  ).length;

  return Math.max(1, Math.ceil(cjkCount / 350 + latinCount / 220));
};
