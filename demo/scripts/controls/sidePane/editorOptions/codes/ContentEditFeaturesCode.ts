import CodeElement from './CodeElement';
import getDefaultContentEditFeatureSettings from '../getDefaultContentEditFeatureSettings';
import { ContentEditFeatureSettings } from 'roosterjs-editor-types';
import { getObjectKeys } from 'roosterjs-editor-dom';

export default class ContentEditFeaturesCode extends CodeElement {
    constructor(private state: ContentEditFeatureSettings) {
        super();
    }

    getCode() {
        let defaultValues = getDefaultContentEditFeatureSettings();
        let features = getObjectKeys(defaultValues)
            .map(key => {
                let checked = this.state[key];

                return typeof checked != 'boolean' || checked == defaultValues[key]
                    ? null
                    : `${key}: ${checked ? 'true' : 'false'},\n`;
            })
            .filter(line => !!line);
        return features.length > 0 ? '{\n' + this.indent(features.join('')) + '}' : '';
    }
}
