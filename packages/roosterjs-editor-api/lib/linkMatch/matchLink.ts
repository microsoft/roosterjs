import { LinkData } from 'roosterjs-editor-types';

interface LinkMatchRule {
    match: RegExp;
    except?: RegExp;
    normalizeUrl?: (url: string) => string;
}

// http exclude matching regex
// invalid URL example (in paricular on IE and Edge):
// - http://www.bing.com%00, %00 before ? (question mark) is considered invalid. IE/Edge throws invalid argument exception
// - http://www.bing.com%1, %1 is invalid
// - http://www.bing.com%g, %g is invalid (IE and Edge expects a two hex value after a %)
// - http://www.bing.com%, % as ending is invalid (IE and Edge expects a two hex value after a %)
// All above % cases if they're after ? (question mark) is then considered valid again
// Similar for @, it needs to be after / (forward slash), or ? (question mark). Otherwise IE/Edge will throw security exception
// - http://www.bing.com@name, @name before ? (question mark) is considered invalid
// - http://www.bing.com/@name, is valid sine it is after / (forward slash)
// - http://www.bing.com?@name, is also valid sinve it is after ? (question mark)
// The regex below is essentially a break down of:
// ^[^?]+%[^0-9a-f]+ => to exclude URL like www.bing.com%%
// ^[^?]+%[0-9a-f][^0-9a-f]+ => to exclude URL like www.bing.com%1
// ^[^?]+%00 => to exclude URL like www.bing.com%00
// ^[^?]+%$ => to exclude URL like www.bing.com%
// ^https?:\/\/[^?\/]+@ => to exclude URL like http://www.bing.com@name
// ^www\.[^?\/]+@ => to exclude URL like www.bing.com@name
const httpExcludeRegEx = /^[^?]+%[^0-9a-f]+|^[^?]+%[0-9a-f][^0-9a-f]+|^[^?]+%00|^[^?]+%$|^https?:\/\/[^?\/]+@|^www\.[^?\/]+@/i;

const linkMatchRules: {[schema: string]: LinkMatchRule} = {
    http: {
        match: /^(microsoft-edge:)?http:\/\/\S+|www\.\S+/i,
        except: httpExcludeRegEx,
        normalizeUrl: url => /^(microsoft-edge:)?http:\/\//i.test(url) ? url : 'http://' + url
    },
    https: {
        match: /^(microsoft-edge:)?https:\/\/\S+/i,
        except: httpExcludeRegEx,
    },
    mailto: { match: /^mailto:\S+@\S+\.\S+/i },
    notes: { match: /^notes:\/\/\S+/i },
    file: { match: /^file:\/\/\/?\S+/i },
    unc: { match: /^\\\\\S+/i },
    ftp: {
        match: /^ftp:\/\/\S+|ftp\.\S+/i,
        normalizeUrl: url => /^ftp:\/\//i.test(url) ? url : 'ftp://' + url
    },
    news: { match: /^news:(\/\/)?\S+/i },
    telnet: { match: /^telnet:\S+/i },
    gopher: { match: /^gopher:\/\/\S+/i },
    wais: { match: /^wais:\S+/i },
};

/**
 * Try to match a given string with link match rules, return matched link
 * @param url Input url to match
 * @param option Link match option, exact or partial. If it is exact match, we need
 * to check the length of matched link and url
 * @param rules Optional link match rules, if not passed, only the default link match
 * rules will be applied
 * @returns The matched link data, or null if no match found.
 * The link data includes an original url and a normalized url
 */
export default function matchLink(url: string): LinkData {
    if (url) {
        for (let schema of Object.keys(linkMatchRules)) {
            let rule = linkMatchRules[schema];
            let matches = url.match(rule.match);
            if (matches && matches[0] == url && (!rule.except || !rule.except.test(url))) {
                return {
                    scheme: schema,
                    originalUrl: url,
                    normalizedUrl: rule.normalizeUrl ? rule.normalizeUrl(url) : url,
                };
            }
        }
    }

    return null;
}
