import CodeElement from './CodeElement';
import { ExperimentalFeatures } from 'roosterjs-editor-types';

export default class ExperimentalFeaturesCode extends CodeElement {
    constructor(private experimentalFeatures: ExperimentalFeatures[]) {
        super();
    }

    getCode() {
        return (this.experimentalFeatures || [])
            .map(name => this.indent("'" + name + "',"))
            .join('\n');
    }
}
