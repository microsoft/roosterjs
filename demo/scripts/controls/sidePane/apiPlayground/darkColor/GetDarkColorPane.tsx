import * as React from 'react';
import ApiPaneProps from '../ApiPaneProps';
import { getDarkColor } from 'roosterjs-color-utils';

interface GetDarkColorPaneState {
    lightColor: string;
    darkColor: string;
}

const styles = require('./GetDarkColorPane.scss');

export default class GetDarkColorPane extends React.Component<ApiPaneProps, GetDarkColorPaneState> {
    private lightColor = React.createRef<HTMLInputElement>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = {
            lightColor: '',
            darkColor: '',
        };
    }

    render() {
        return (
            <>
                <div>
                    Light Color:{' '}
                    <input
                        type="input"
                        ref={this.lightColor}
                        onChange={this.onInputChange}
                        value={this.state.lightColor}
                    />
                </div>
                <hr />
                <div>
                    Light Color:
                    <div className={styles.lightBackground}>
                        <div
                            className={styles.result}
                            style={{ backgroundColor: this.state.lightColor }}
                        />
                    </div>
                </div>
                <div>
                    DarkColor: <span>{this.state.darkColor}</span>
                    <div className={styles.darkBackground}>
                        <div
                            className={styles.result}
                            style={{ backgroundColor: this.state.darkColor }}
                        />
                    </div>
                </div>
            </>
        );
    }

    private onInputChange = () => {
        let lightColor = this.lightColor.current.value;
        let darkColor = '';

        try {
            darkColor = getDarkColor(lightColor);
        } catch (e) {
            darkColor = e;
        }

        this.setState({
            lightColor: lightColor,
            darkColor: darkColor,
        });
    };
}
