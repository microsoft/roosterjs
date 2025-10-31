import * as React from 'react';
import { ApiPaneProps, ApiPlaygroundComponent } from '../ApiPaneProps';
import { find, moveHighlight, replace } from 'roosterjs-content-model-plugins';
import { MainPane } from '../../../mainPane/MainPane';
import { PluginEvent } from 'roosterjs-content-model-types';

interface FindReplacePaneState {
    showReplace: boolean;
    resultCount: number;
    currentIndex: number;
    passedEnd: boolean;
}

export default class FindReplacePane extends React.Component<ApiPaneProps, FindReplacePaneState>
    implements ApiPlaygroundComponent {
    private findTextRef = React.createRef<HTMLInputElement>();
    private replaceTextRef = React.createRef<HTMLInputElement>();
    private matchCaseRef = React.createRef<HTMLInputElement>();
    private wholeWordRef = React.createRef<HTMLInputElement>();
    private replaceRef = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            showReplace: false,
            resultCount: 0,
            currentIndex: -1,
            passedEnd: false,
        };
    }

    public onPluginEvent = (e: PluginEvent) => {
        if (e.eventType == 'findResultChanged') {
            const { markedIndex, ranges, alternativeRange } = e;

            this.setState({
                currentIndex: markedIndex,
                resultCount: ranges.length,
            });

            if (markedIndex < 0 && alternativeRange) {
                this.props.getEditor().setDOMSelection({
                    type: 'range',
                    range: alternativeRange,
                    isReverted: false,
                });
            }
        }
    };

    render() {
        return (
            <>
                <div>
                    Find: <input type="text" ref={this.findTextRef} onChange={this.find} />
                </div>
                <div>
                    <input
                        type="checkbox"
                        ref={this.matchCaseRef}
                        onClick={this.find}
                        id="matchCase"
                    />
                    <label htmlFor="matchCase"> Match Case</label>
                </div>
                <div>
                    <input
                        type="checkbox"
                        ref={this.wholeWordRef}
                        onClick={this.find}
                        id="wholeWord"
                    />
                    <label htmlFor="wholeWord"> Whole Word</label>
                </div>
                <div>
                    Results Found:{' '}
                    {this.state.currentIndex < 0
                        ? this.state.resultCount
                        : `${this.state.currentIndex + 1} / ${this.state.resultCount}`}
                </div>
                <div>
                    <button onClick={this.movePrevious}>Previous</button>
                    <button onClick={this.moveNext}>Next</button>
                </div>
                {this.state.passedEnd && <div>You have passed the end of the document.</div>}
                <hr />
                <div>
                    <input
                        type="checkbox"
                        ref={this.replaceRef}
                        onChange={this.showHideReplace}
                        id="replace"
                    />
                    <label htmlFor="replace"> Replace</label>
                </div>
                {this.state.showReplace && (
                    <div>
                        <div>
                            Replace with: <input type="text" ref={this.replaceTextRef} />
                        </div>
                        <div>
                            <button onClick={this.replace} disabled={this.state.resultCount == 0}>
                                Replace
                            </button>
                            <button
                                onClick={this.replaceAll}
                                disabled={this.state.resultCount == 0}>
                                Replace All
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    private find = () => {
        const context = MainPane.getInstance().getFindReplaceContext();

        find(
            this.props.getEditor(),
            context,
            this.findTextRef.current?.value ?? null,
            this.matchCaseRef.current?.checked,
            this.wholeWordRef.current?.checked
        );

        this.setState({ resultCount: context.ranges.length, currentIndex: -1, passedEnd: false });
    };

    private showHideReplace = () => {
        this.setState(prevState => ({ showReplace: !prevState.showReplace }));
    };

    private replace = () => {
        const context = MainPane.getInstance().getFindReplaceContext();

        replace(this.props.getEditor(), context, this.replaceTextRef.current?.value || '');

        this.setState({ resultCount: context.ranges.length, currentIndex: -1, passedEnd: false });
    };

    private replaceAll = () => {
        const context = MainPane.getInstance().getFindReplaceContext();

        replace(this.props.getEditor(), context, this.replaceTextRef.current?.value || '', true);

        this.setState({ resultCount: context.ranges.length, currentIndex: -1, passedEnd: false });
    };

    private movePrevious = () => {
        const oldIndex = this.state.currentIndex;
        const context = MainPane.getInstance().getFindReplaceContext();

        moveHighlight(this.props.getEditor(), context, false);

        this.setState({
            currentIndex: context.markedIndex,
            passedEnd: oldIndex < context.markedIndex,
        });
    };

    private moveNext = () => {
        const oldIndex = this.state.currentIndex;
        const context = MainPane.getInstance().getFindReplaceContext();

        moveHighlight(this.props.getEditor(), context, true);

        this.setState({
            currentIndex: context.markedIndex,
            passedEnd: oldIndex > context.markedIndex,
        });
    };
}
