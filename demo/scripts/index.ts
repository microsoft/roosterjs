import { mount } from './controls/MainPane';
import { mount as mountV2 } from './controlsV2/mainPane/MainPane';

const search = document.location.search.substring(1).split('&');
const mainPaneDiv = document.getElementById('mainPane');

if (search.some(x => x == 'legacy=1')) {
    mount(mainPaneDiv);
} else {
    mountV2(mainPaneDiv);
}
