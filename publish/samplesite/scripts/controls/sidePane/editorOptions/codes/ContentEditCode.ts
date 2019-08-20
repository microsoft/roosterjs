import CodeElement from './CodeElement';
import { ContentEditFeatureState } from '../../../BuildInPluginState';
import { getDefaultContentEditFeatures } from 'roosterjs-editor-plugins';

export default class ContentEditCode extends CodeElement {
    constructor(private state: ContentEditFeatureState) {
        super();
    }

    getCode() {
        let defaultValues = getDefaultContentEditFeatures();
        let features = Object.keys(defaultValues)
            .map(key => {
                let checked = (<any>this.state)[key];

                return typeof checked != 'boolean' || checked == (<any>defaultValues)[key]
                    ? null
                    : `${key}: ${checked ? 'true' : 'false'},\n`;
            })
            .filter(line => !!line);
        return features.length > 0
            ? 'new roosterjs.ContentEdit(Object.assign(roosterjs.getDefaultContentEditFeatures(), {\n' +
                  this.indent(features.join('')) +
                  '}))'
            : 'new roosterjs.ContentEdit()';
    }
}
