import * as React from 'react';
import { ContentModelDocument } from 'roosterjs-content-model';
import { safeInstanceOf } from 'roosterjs-editor-dom';
import { SidePaneElementProps } from '../SidePaneElement';

const styles = require('./ContentModelPane.scss');

export interface ContentModelPaneState {
    model: ContentModelDocument;
}

export interface ContentModelPaneProps extends ContentModelPaneState, SidePaneElementProps {
    onUpdateModel: () => ContentModelDocument;
    onCreateDOM: (model: ContentModelDocument) => void;
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
        this.props.onCreateDOM(this.state.model);
    };

    private onRefresh = () => {
        const model = this.props.onUpdateModel();
        this.setContentModel(model);
    };
}
