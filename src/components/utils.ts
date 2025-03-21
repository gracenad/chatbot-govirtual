import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false });

export const parseMarkdown = (text: string): string => {
    return md.render(text);
};
