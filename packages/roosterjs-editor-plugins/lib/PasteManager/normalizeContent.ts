const INLINE_POSITION_STYLE = /(<\w+[^>]*style=['"][^>]*)position:[^>;'"]*/gi;
const TEXT_WITH_BR_ONLY = /^[^<]*(<br>[^<]*)+$/i;
const COMMENT = /<!--([\s\S]*?)-->/gi;

export default function normalizeContent(content: string): string {
    // Remove 'position' style from source HTML
    content = content.replace(INLINE_POSITION_STYLE, '$1');
    content = content.replace(COMMENT, '');

    // Replace <BR> with <DIV>
    if (TEXT_WITH_BR_ONLY.test(content)) {
        content = '<div>' + content.replace(/<br>/gi, '</div><div>') + '<br></div>';
    }

    return content;
}
