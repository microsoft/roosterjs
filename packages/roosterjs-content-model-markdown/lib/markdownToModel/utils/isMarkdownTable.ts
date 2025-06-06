/**
 * @internal
 */
export function isMarkdownTable(text: string): boolean {
    const columns = text.split('|').filter(s => s !== '');
    const pattern = /^:?-+:?$/;

    return columns.length > 0 && columns.every(c => pattern.test(c.trim()));
}
