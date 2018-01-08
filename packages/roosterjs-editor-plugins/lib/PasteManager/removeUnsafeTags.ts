const ZERO_WIDTH_SPACE = '\u200b';
const UNSAFE_TAG_SUMMARY_REGEX = /<(script|iframe|applet|object|embed|meta|base)/i;
const UNSAFE_TAG_REGEX = [
    /<script\s*[^>]*>[\s\S]*<\/script\s*>/gi,
    /<iframe\s*[^>]*>[\s\S]*<\/iframe\s*>/gi,
    /<applet\s*[^>]*>[\s\S]*<\/applet\s*>/gi,
    /<object\s*[^>]*>[\s\S]*<\/object\s*>/gi,
    /<embed\s*[^>]*>[\s\S]*<\/embed\s*>/gi,
    /<meta\s*[^>]*>[\s\S]*<\/meta\s*>/gi,
    /<base\s*[^>]*>[\s\S]*<\/base\s*>/gi,
];
const UNSAFE_ATTRIBUTE_REGEX = [/<(\w+)([^>]*\W+)on\w+\s*=\s*('[^']*'|"[^"]*"|[^'"\s]*)/gi];

export default function removeUnsafeTags(html: string): string {
    if (UNSAFE_TAG_SUMMARY_REGEX.test(html)) {
        UNSAFE_TAG_REGEX.forEach(regex => {
            html = html.replace(regex, ZERO_WIDTH_SPACE); // Use zero width space rather than empty string to handle cases like <scr<script>ipt>
        });
    }
    UNSAFE_ATTRIBUTE_REGEX.forEach(regex => {
        while (regex.test(html)) {
            html = html.replace(regex, '<$1$2');
        }
    });
    return html;
}
