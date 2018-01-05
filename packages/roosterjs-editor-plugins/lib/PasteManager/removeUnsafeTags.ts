const ZERO_WIDTH_SPACE = '\u200b';
const UNSAFE_TAG_REGEX = [
    /<script\s*[^>]*>[\s\S]*<\/script>/gi,
    /<iframe\s*[^>]*>[\s\S]*<\/iframe>/gi,
    /<applet\s*[^>]*>[\s\S]*<\/applet>/gi,
    /<object\s*[^>]*>[\s\S]*<\/object>/gi,
    /<embed\s*[^>]*>[\s\S]*<\/embed>/gi,
    /<meta\s*[^>]*>[\s\S]*<\/meta>/gi,
];
const UNSAFE_ATTRIBUTE_REGEX = [
    /<(\w+)([^>]*\W+)on\w+\s*=\s*('[^']*'|"[^"]*"|[^'"\s]*)/gi,
];

export default function removeUnsafeTags(html: string): string {
    UNSAFE_TAG_REGEX.forEach(regex => {
        html = html.replace(regex, ZERO_WIDTH_SPACE); // Use zero width space rather than empty string to handle cases like <scr<script>ipt>
    });
    UNSAFE_ATTRIBUTE_REGEX.forEach(regex => {
        while (regex.test(html)) {
            html = html.replace(regex, '<$1$2');
        }
    })
    return html;
}
