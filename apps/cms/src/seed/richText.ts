const paragraph = (text: string) => ({
  type: 'paragraph',
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  version: 1,
  textFormat: 0,
  children: [{ type: 'text', text, detail: 0, format: 0, mode: 'normal', style: '', version: 1 }],
})

/** Lexical rich text value made of plain paragraphs. */
export const paragraphs = (...texts: string[]) => ({
  root: {
    type: 'root',
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
    children: texts.map(paragraph),
  },
})
