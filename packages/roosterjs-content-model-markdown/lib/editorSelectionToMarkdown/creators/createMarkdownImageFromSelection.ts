/**
 * @internal
 */
export function createMarkdownImageFromSelection(image: HTMLImageElement): string {
    const { src, alt, title } = image;
    return `![${alt || title || 'image'}](${src})`;
}
