import * as React from 'react';
import { addRangeToSelection, safeInstanceOf } from 'roosterjs-editor-dom';
import { ContentModelDocument, createDOMFromContentModel } from 'roosterjs-content-model';
import { SelectionRangeTypes } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    onUpdateModel: () => ContentModelDocument;
}

export default class ContentModelPane extends React.Component<
    ContentModelPaneProps,
    ContentModelPaneState
> {
    constructor(props: ContentModelPaneProps) {
        super(props);

        this.state = {
            model: null,
        };
    }

    setContentModel(model: ContentModelDocument) {
        this.setState({
            model: model,
        });
    }

    render() {
        return this.state.model ? (
            <>
                <div>
                    <button onClick={this.onRefresh}>Refresh Content Model</button>&nbsp;
                    <button onClick={this.onCreateDOM}>Create DOM tree</button>
                </div>
                <div className={styles.contentModel}>
                    <pre>
                        {JSON.stringify(
                            this.state.model,
                            (key, value) => {
                                return safeInstanceOf(value, 'Node')
                                    ? Object.prototype.toString.apply(value)
                                    : value;
                            },
                            2
                        )}
                    </pre>
                </div>
            </>
        ) : null;
    }

    private onCreateDOM = () => {
        const [fragment, selection] = createDOMFromContentModel(this.state.model);
        const win = window.open('about:blank');

        win.document.body.appendChild(fragment);

        if (selection) {
            switch (selection.type) {
                case SelectionRangeTypes.Normal:
                    addRangeToSelection(selection.ranges[0]);
                    break;

                case SelectionRangeTypes.TableSelection:
                    // TODO
                    break;
            }
        }
    };

    private onRefresh = () => {
        const model = this.props.onUpdateModel();
        this.setContentModel(model);
    };
}
