const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * Build DOM tree from the given HTML string
 * @param html Source HTML string
 * @param preserveFragmentOnly If there is fragment markup (<!--StartFragment--> and <!--EndFragment-->),
 * only preserve content between these markups
 * @param fragmentHandler An optional callback to do customized fragment handling
 */
export default function htmlToDom(
    html: string,
    preserveFragmentOnly: boolean,
    fragmentHandler?: (doc: HTMLDocument, sourceHtml: string) => void
): HTMLDocument {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html || '', 'text/html');

    if (doc && doc.body && doc.body.firstChild) {
        // 1. Filter out html code outside of Fragment tags if need
        if (preserveFragmentOnly) {
            (fragmentHandler || defaultFragmentTrimmer)(doc, html);
        }

        return doc;
    } else {
        return null;
    }
}

function defaultFragmentTrimmer(doc: HTMLDocument, sourceHtml: string) {
    let [html] = splitWithFragment(sourceHtml);
    doc.body.innerHTML = html;
}

/**
 * Split the HTML string using its fragment info
 * @param html Source html string
 * @returns [String within fragment, String before fragment, String after fragment]
 */
export function splitWithFragment(html: string): [string, string, string] {
    let startIndex = html.indexOf(START_FRAGMENT);
    let endIndex = html.lastIndexOf(END_FRAGMENT);
    if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        let before = html.substr(0, startIndex);
        let after = html.substr(endIndex + END_FRAGMENT.length);
        html = html.substring(startIndex + START_FRAGMENT.length, endIndex);
        return [html, before, after];
    } else {
        return [html, null, null];
    }
}
