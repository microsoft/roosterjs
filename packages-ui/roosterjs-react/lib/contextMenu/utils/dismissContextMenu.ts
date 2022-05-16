import * as ReactDOM from 'react-dom';

/**
 * @internal
 */

export default function dismissContextMenu(container: HTMLElement) {
    ReactDOM.unmountComponentAtNode(container);
}
