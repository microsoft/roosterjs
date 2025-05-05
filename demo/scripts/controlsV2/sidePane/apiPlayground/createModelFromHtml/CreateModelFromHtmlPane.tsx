import * as React from 'react';
import { ApiPaneProps } from '../ApiPaneProps';
import { cloneModel } from 'roosterjs-content-model-dom';
import { ContentModelDocument } from 'roosterjs-content-model-types';
import { ContentModelDocumentView } from '../../contentModel/components/model/ContentModelDocumentView';
import { createModelFromHtml } from 'roosterjs-content-model-core';

const styles = require('./CreateModelFromHtmlPane.scss');

interface CreateModelFromHtmlPaneState {
    model: ContentModelDocument | null;
}

export default class CreateModelFromHtmlPane extends React.Component<
    ApiPaneProps,
    CreateModelFromHtmlPaneState
> {
    private html = React.createRef<HTMLTextAreaElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            model: null,
        };
    }

    render() {
        return (
            <>
                <div>HTML:</div>
                <div>
                    <textarea className={styles.textarea} ref={this.html}></textarea>
                </div>
                <div>
                    <button onClick={this.createModel}>Create Model</button>
                </div>
                <div>
                    {this.state.model ? <ContentModelDocumentView doc={this.state.model} /> : null}
                </div>
                <div>
                    <button onClick={this.setModel} disabled={!this.state.model}>
                        Set Model into Editor
                    </button>
                </div>
            </>
        );
    }

    private createModel = () => {
        const html = this.html.current?.value || '';

        if (html) {
            const model = createModelFromHtml(
                html,
                undefined,
                this.props.getEditor().getDOMCreator()
            );
            this.setState({ model });
        } else {
            this.setState({ model: null });
        }
    };

    private setModel = () => {
        if (this.state.model) {
            this.props.getEditor().formatContentModel(model => {
                model.blocks = cloneModel(this.state.model).blocks;

                return true;
            });
        }
    };
}
