import CodeElement from './CodeElement';
import { UrlPlaceholder } from '../../../BuildInPluginState';

export default class HyperLinkCode extends CodeElement {
    constructor(private linkTitle: string) {
        super();
    }

    getCode() {
        return 'new roosterjs.HyperLink(' + this.getLinkCallback() + ')';
    }

    private getLinkCallback() {
        if (!this.linkTitle) {
            return '';
        }

        let index = this.linkTitle.indexOf(UrlPlaceholder);
        if (index >= 0) {
            let left = this.linkTitle.substr(0, index);
            let right = this.linkTitle.substr(index + UrlPlaceholder.length);
            return (
                'url => ' +
                (left ? `'${this.encode(left)}' + ` : '') +
                'url' +
                (right ? ` + '${this.encode(right)}'` : '')
            );
        } else {
            return `() => '${this.linkTitle}'`;
        }
    }
}
