/**
 * @internal
 */
export function isMarkdownTable(text: string): boolean {
    const columns = text.split('|').filter(s => s !== '');
    console.log(columns);
    const pattern = /^:?-+:?$/;
    return columns.length > 1 && columns.every(c => pattern.test(c.trim()));
}
