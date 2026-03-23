import { stripInvisibleUnicode } from 'roosterjs-content-model-dom';

/**
 * @internal Check if there is XSS attack in the link
 * @param link The link to be checked
 * @returns The safe link with invisible Unicode characters stripped, or empty string if there is XSS attack
 * @remarks This function strips invisible Unicode characters (zero-width chars, Unicode Tags, etc.)
 * and checks for patterns like s\nc\nr\ni\np\nt: to prevent XSS attacks. This may block some valid links,
 * but it is necessary for security reasons. We treat the word "script" as safe if there are "/" before it.
 */
export function checkXss(link: string): string {
    // Defense-in-depth: strip invisible Unicode even if already handled elsewhere
    const sanitized = stripInvisibleUnicode(link);
    return sanitized.match(/^[^\/]*s\n*c\n*r\n*i\n*p\n*t\n*:/i) ? '' : sanitized;
}
