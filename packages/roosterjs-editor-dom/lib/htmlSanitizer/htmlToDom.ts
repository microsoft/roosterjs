const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

/**
 * Build DOM tree from the given HTML string
 * @param html Source HTML string
 * @param preserveFragmentOnly If there is fragment markup (&lt;!--StartFragment--&gt; and &lt;!--EndFragment--&gt;),
 * only preserve content between these markups
 * @param fragmentHandler An optional callback to do customized fragment handling
 */
export default function htmlToDom(html: string, preserveFragmentOnly: boolean): HTMLDocument {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html || '', 'text/html');

    if (doc && doc.body && doc.body.firstChild) {
        // 1. Filter out html code outside of Fragment tags if need
        if (preserveFragmentOnly) {
            doc.body.innerHTML = splitWithFragment(html);
        }

        return doc;
    } else {
        return null;
    }
}

/**
 * Split the HTML string using its fragment info
 * @param html Source html string
 * @returns [String within fragment, String before fragment, String after fragment]
 */
function splitWithFragment(html: string) {
    let startIndex = html.indexOf(START_FRAGMENT);
    let endIndex = html.lastIndexOf(END_FRAGMENT);
    if (startIndex >= 0 && endIndex >= 0 && endIndex >= startIndex + START_FRAGMENT.length) {
        return html.substring(startIndex + START_FRAGMENT.length, endIndex);
    } else {
        return html;
    }
}
