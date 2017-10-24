import defaultLinkMatchRules from './defaultLinkMatchRules';
import { LinkData, LinkMatchOption, LinkMatchRule } from 'roosterjs-editor-types';

/**
 * Try to match a given string with link match rules, return matched link
 * @param url Input url to match
 * @param option Link match option, exact or partial
 * @param rules Optional link match rules
 */
function matchLink(url: string, option: LinkMatchOption = LinkMatchOption.Exact, rules?: LinkMatchRule[]): LinkData {
    if (!url) {
        return null;
    }

    rules = rules || defaultLinkMatchRules;
    let matchedLink: LinkData = null;
    for (let rule of rules) {
        let link = rule.include(url);
        // For exact match, also need to check the length
        if (link && (option != LinkMatchOption.Exact || url.length == link.originalUrl.length)) {
            // We have a matched link. Now take the matched portion and do an exclude test
            if (rule.exclude && rule.exclude(link.originalUrl)) {
                continue;
            } else {
                matchedLink = link;
                break;
            }
        }
    }

    return matchedLink;
}

export default matchLink;
