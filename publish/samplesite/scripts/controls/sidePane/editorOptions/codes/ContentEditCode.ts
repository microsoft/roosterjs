import CodeElement from './CodeElement';
import { ContentEditFeatureState } from '../../../BuildInPluginState';
import { getDefaultContentEditFeatures } from 'roosterjs-editor-plugins';

export default class ContentEditCode extends CodeElement {
    constructor(private state: ContentEditFeatureState) {
        super();
    }

    getImports() {
        return [
            {
                name: 'ContentEdit',
                path: 'roosterjs-editor-plugins',
                isDefault: false,
            },
            {
                name: 'getDefaultContentEditFeatures',
                path: 'roosterjs-editor-plugins',
                isDefault: false,
            },
        ];
    }

    getCode() {
        let defaultValues = getDefaultContentEditFeatures();
        let features = Object.keys(defaultValues)
            .map(key => {
                let checked = this.state[key];

                return typeof checked != 'boolean' || checked == defaultValues[key]
                    ? null
                    : `${key}: ${checked ? 'true' : 'false'},\n`;
            })
            .filter(line => !!line);
        return features.length > 0
            ? 'new ContentEdit(Object.assign(getDefaultContentEditFeatures(), {\n' +
                  this.indent(features.join('')) +
                  '}))'
            : 'new ContentEdit()';
    }
}
