/**
 * Normalize font family string to a standard format
 * Add quotes around font family names that contain non-alphanumeric/dash characters
 * @param fontFamily The font family string to normalize
 * @returns The normalized font family string
 */
export function normalizeFontFamily(fontFamily: string): string {
    const existingQuotedFontsRegex = /(".*?")|('.*?')/g;
    let match = existingQuotedFontsRegex.exec(fontFamily);
    let start = 0;
    const result: string[] = [];

    while (match) {
        process(fontFamily, result, start, match.index);

        start = match.index + match[0].length;
        result.push(match[0]);

        match = existingQuotedFontsRegex.exec(fontFamily);
    }

    process(fontFamily, result, start, fontFamily.length);

    return result.join(', ');
}

function process(fontFamily: string, result: string[], start: number, end: number) {
    const families = fontFamily.substring(start, end).split(',');

    families.forEach(family => {
        family = family.trim();

        if (family) {
            // Check if the family name contains non-alphanumeric characters
            if (/[^a-zA-Z0-9\-]/.test(family)) {
                result.push(`"${family}"`);
            } else {
                result.push(family);
            }
        }
    });
}
