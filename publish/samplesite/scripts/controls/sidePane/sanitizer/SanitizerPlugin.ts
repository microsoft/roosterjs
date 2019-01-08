import SanitizerPane from './SanitizerPane';
import SidePanePluginImpl from '../SidePanePluginImpl';

export default class SanitizerPlugin extends SidePanePluginImpl<SanitizerPane, {}> {
    constructor() {
        super(SanitizerPane, 'sanitizer', 'HTML Sanitizer');
    }

    getComponentProps() {
        return {};
    }
}
