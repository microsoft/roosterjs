const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';
const LAST_TD_END_REGEX = /<\/\s*td\s*>((?!<\/\s*tr\s*>)[\s\S])*$/i;
const LAST_TR_END_REGEX = /<\/\s*tr\s*>((?!<\/\s*table\s*>)[\s\S])*$/i;
const LAST_TR_REGEX = /<tr[^>]*>[^<]*/i;
const LAST_TABLE_REGEX = /<table[^>]*>[^<]*/i;

/**
 * Build DOM tree from the given HTML string
 * @param html Source HTML string
 * @param preserveFragmentOnly If there is fragment markup (<!--StartFragment--> and <!--EndFragment-->),
 * only preserve content between these markups
 */
export default function htmlToDom(html: string, preserveFragmentOnly: boolean): HTMLDocument {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html || '', 'text/html');

    if (doc && doc.body && doc.body.firstChild) {
        // 1. Filter out html code outside of Fragment tags if need
        if (preserveFragmentOnly) {
            html = trimWithinFragment(html);
            doc.body.innerHTML = html;
        }

        return doc;
    } else {
        return null;
    }
}

function trimWithinFragment(html: string): string {
    let startIndex = html.indexOf(START_FRAGMENT);
    let endIndex = html.lastIndexOf(END_FRAGMENT);
    if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        let before = html.substr(0, startIndex);
        html = html.substring(startIndex + START_FRAGMENT.length, endIndex);

        // Fix up table for Excel
        if (html.match(LAST_TD_END_REGEX)) {
            let trMatch = before.match(LAST_TR_REGEX);
            let tr = trMatch ? trMatch[0] : '<TR>';
            html = tr + html + '</TR>';
        }
        if (html.match(LAST_TR_END_REGEX)) {
            let tableMatch = before.match(LAST_TABLE_REGEX);
            let table = tableMatch ? tableMatch[0] : '<TABLE>';
            html = table + html + '</TABLE>';
        }
    }

    return html;
}
