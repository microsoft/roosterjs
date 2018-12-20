import SanitizerPane from './SanitizerPane';
import SidePanePluginImpl from '../SidePanePluginImpl';
import { PluginEvent, PluginEventType } from 'roosterjs-editor-types';

export default class SanitizerPlugin extends SidePanePluginImpl<SanitizerPane, {}> {
    constructor() {
        super(SanitizerPane, 'sanitizer', 'HTML Sanitizer');
    }

    getComponentProps() {
        return {};
    }
}
