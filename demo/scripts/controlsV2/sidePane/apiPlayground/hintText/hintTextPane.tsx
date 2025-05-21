import * as React from 'react';
import { addHintText } from 'roosterjs-content-model-plugins';
import { ApiPaneProps, ApiPlaygroundComponent } from '../ApiPaneProps';
import { getSelectedSegmentsAndParagraphs } from 'roosterjs-content-model-dom';
import type { PluginEvent } from 'roosterjs-content-model-types';

export default class HintTextPane extends React.Component<ApiPaneProps, {}>
    implements ApiPlaygroundComponent {
    private word: React.RefObject<HTMLInputElement> = React.createRef();
    private hintText: React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props: ApiPaneProps) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <>
                <div>
                    When type word: <input type="text" ref={this.word} />
                </div>
                <div>
                    Insert hint text: <input type="text" ref={this.hintText} />
                </div>
            </>
        );
    }

    onPluginEvent(e: PluginEvent) {
        const word = this.word.current.value;
        const hintText = this.hintText.current.value;
        const editor = this.props.getEditor();

        if (e.eventType == 'input' && word && hintText) {
            let shouldAdd = false;

            // Demo code only, do not do this in real production
            editor.formatContentModel(model => {
                const selections = getSelectedSegmentsAndParagraphs(model, false, false);

                if (selections.length == 1 && selections[0][0].segmentType == 'SelectionMarker') {
                    const [segment, paragraph] = selections[0];
                    const index = paragraph.segments.indexOf(segment);
                    const text = index > 0 ? paragraph.segments[index - 1] : null;

                    if (text.segmentType == 'Text' && text.text.endsWith(this.word.current.value)) {
                        shouldAdd = true;
                    }
                }

                return false;
            });

            if (shouldAdd) {
                addHintText(editor, hintText);
            }
        }
    }
}
