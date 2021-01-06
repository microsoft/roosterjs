import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { LinkData } from 'roosterjs-editor-types';
import { matchLink } from 'roosterjs-editor-dom';

interface MatchLinkState {
    linkData: LinkData;
}

export default class MatchLinkPane extends React.Component<ApiPaneProps, MatchLinkState> {
    private url = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = { linkData: undefined };
    }

    render() {
        let { scheme, originalUrl, normalizedUrl } = this.state.linkData || ({} as LinkData);
        return (
            <>
                <div>
                    Url: <input type="input" ref={this.url} />{' '}
                    <button onClick={this.onMatchLink}>Match Link</button>
                </div>
                {this.state.linkData === null ? (
                    <div>Not matched</div>
                ) : (
                    <>
                        <div>Schema: {scheme || ''}</div>
                        <div>Original Url: {originalUrl || ''}</div>
                        <div>Normalized Url: {normalizedUrl || ''}</div>
                    </>
                )}
            </>
        );
    }

    private onMatchLink = () => {
        let match = matchLink(this.url.current.value);
        this.setState({
            linkData: match,
        });
    };
}
