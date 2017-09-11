import { LinkData, LinkMatchOption, LinkMatchRule } from 'roosterjs-types';

// Match a url against the rules
function matchLink(url: string, option: LinkMatchOption, rules: LinkMatchRule[]): LinkData {
    if (!url || !rules || rules.length == 0) {
        return null;
    }

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
