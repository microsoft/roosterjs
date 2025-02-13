const linkRegex = /(\[([^\[]+)\]\((https?:\/\/[^\)]+)\))|(\!\[([^\[]+)\]\((https?:\/\/[^\)]+)\))/g;

/**
 * @internal
 */
export function splitLinkAndImages(text: string): string[] {
    const result = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            result.push(text.slice(lastIndex, match.index));
        }

        result.push(match[0]);

        lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        result.push(text.slice(lastIndex));
    }

    return result;
}
