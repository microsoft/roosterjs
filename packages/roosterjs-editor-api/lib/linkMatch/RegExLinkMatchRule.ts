import { LinkData, LinkMatchRule } from 'roosterjs-editor-types';

// The RegExLinkMatchRule which takes an inclusion regex and an exclusion regex
export default class RegExLinkMatchRule implements LinkMatchRule {
    constructor(
        private scheme: string,
        private prefix: string,
        private includeRegEx: RegExp,
        private excludeRegEx?: RegExp
    ) {}

    // The include check
    public include(url: string): LinkData {
        // Check if it meets minimum length, and there are some rules
        if (!url || !this.includeRegEx) {
            return null;
        }

        let matchedLinkData: LinkData;
        let matches: string[];
        if ((matches = url.match(this.includeRegEx)) && matches.length > 0) {
            // We have a match
            let matchedUrl = matches[0];
            let normalizedUrl =
                matchedUrl.indexOf(this.prefix) == 0 ? matchedUrl : this.prefix + matchedUrl;
            matchedLinkData = {
                scheme: this.scheme,
                prefix: this.prefix,
                originalUrl: matchedUrl,
                normalizedUrl: normalizedUrl,
            };
        }

        return matchedLinkData;
    }

    // The exclude check
    public exclude(url: string): boolean {
        let shouldExclude = false;
        if (url && this.excludeRegEx) {
            shouldExclude = this.excludeRegEx.test(url);
        }

        return shouldExclude;
    }
}
