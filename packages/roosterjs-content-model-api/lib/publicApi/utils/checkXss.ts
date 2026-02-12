/**
 * @internal Check if there is XSS attack in the link
 * @param link The link to be checked
 * @returns The safe link, or empty string if there is XSS attack
 * @remarks This function checks for patterns like s\nc\nr\ni\np\nt: to prevent XSS attacks. This may block some valid links,
 * but it is necessary for security reasons. We treat the word "script" as safe if there are "/" before it.
 */
export function checkXss(link: string): string {
    return link.match(/^[^\/]*s\n*c\n*r\n*i\n*p\n*t\n*:/i) ? '' : link;
}
