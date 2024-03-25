import CodeElement from './CodeElement';
import ContentEditFeaturesCode from './ContentEditFeaturesCode';
import { ContentEditFeatureSettings } from 'roosterjs-editor-types';

export default class ContentEditCode extends CodeElement {
    private features: ContentEditFeaturesCode;
    constructor(settings: ContentEditFeatureSettings) {
        super();
        this.features = new ContentEditFeaturesCode(settings);
    }

    getCode() {
        return 'new roosterjsLegacy.ContentEdit(' + this.features.getCode() + ')';
    }
}
