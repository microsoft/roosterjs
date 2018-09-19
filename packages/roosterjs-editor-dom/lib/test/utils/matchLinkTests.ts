import matchLink from '../../utils/matchLink';
import { LinkData } from 'roosterjs-editor-types';

function runMatchTestWithValidLink(link: string, expected: LinkData): void {
    let resultData = matchLink(link);
    expect(resultData).not.toBe(null);
    expect(resultData.scheme).toBe(expected.scheme);
    expect(resultData.originalUrl).toBe(expected.originalUrl);
    expect(resultData.normalizedUrl).toBe(expected.normalizedUrl);
}

function runMatchTestWithBadLink(link: string): void {
    let linkData = matchLink(link);
    expect(linkData).toBeNull();
}

describe('defaultLinkMatchRules regular http links with extact match', () => {
    it('http://www.bing.com', () => {
        let link = 'http://www.bing.com';
        runMatchTestWithValidLink(link, { scheme: 'http', originalUrl: link, normalizedUrl: link });
    });

    it('http://www.bing.com/', () => {
        let link = 'http://www.bing.com/';
        runMatchTestWithValidLink(link, { scheme: 'http', originalUrl: link, normalizedUrl: link });
    });

    it('http://www.lifewire.com/how-torrent-downloading-works-2483513', () => {
        let link = 'http://www.lifewire.com/how-torrent-downloading-works-2483513';
        runMatchTestWithValidLink(link, { scheme: 'http', originalUrl: link, normalizedUrl: link });
    });
});

describe('defaultLinkMatchRules regular www links with extact match', () => {
    it('www.eartheasy.com/grow_compost.html', () => {
        let link = 'www.eartheasy.com/grow_compost.html';
        runMatchTestWithValidLink(link, {
            scheme: 'http',
            originalUrl: link,
            normalizedUrl: 'http://' + link,
        });
    });
});

describe('defaultLinkMatchRules regular https links with extact match', () => {
    it('https://en.wikipedia.org/wiki/Compost', () => {
        let link = 'https://en.wikipedia.org/wiki/Compost';
        runMatchTestWithValidLink(link, {
            scheme: 'https',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('https://www.youtube.com/watch?v=e3Nl_TCQXuw', () => {
        let link = 'https://www.youtube.com/watch?v=e3Nl_TCQXuw';
        runMatchTestWithValidLink(link, {
            scheme: 'https',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('https://www.bing.com/news/search?q=MSFT&qpvt=msft&FORM=EWRE', () => {
        let link = 'https://www.bing.com/news/search?q=MSFT&qpvt=msft&FORM=EWRE';
        runMatchTestWithValidLink(link, {
            scheme: 'https',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('https://microsoft.sharepoint.com/teams/peopleposse/Shared%20Documents/Feedback%20Plan.pptx?web=1', () => {
        let link =
            'https://microsoft.sharepoint.com/teams/peopleposse/Shared%20Documents/Feedback%20Plan.pptx?web=1';
        runMatchTestWithValidLink(link, {
            scheme: 'https',
            originalUrl: link,
            normalizedUrl: link,
        });
    });
});

describe('defaultLinkMatchRules special http links that has % and @, but is valid', () => {
    it('www.test.com/?test=test%00it', () => {
        // URL: www.test.com/?test=test%00it %00 => %00 is invalid percent encoding but URL is valid since it is after ?
        let link = 'www.test.com/?test=test%00it';
        runMatchTestWithValidLink(link, {
            scheme: 'http',
            originalUrl: link,
            normalizedUrl: 'http://' + link,
        });
    });

    it('http://www.test.com/?test=test%hhit', () => {
        // URL: http://www.test.com/?test=test%hhit => %h is invalid encoding, but URL is valid since it is after ?
        let link = 'http://www.test.com/?test=test%hhit';
        runMatchTestWithValidLink(link, { scheme: 'http', originalUrl: link, normalizedUrl: link });
    });

    it('www.test.com/kitty@supercute.com', () => {
        // URL: www.test.com/kitty@supercute.com => @ is valid when it is after /
        let link = 'www.test.com/kitty@supercute.com';
        runMatchTestWithValidLink(link, {
            scheme: 'http',
            originalUrl: link,
            normalizedUrl: 'http://' + link,
        });
    });

    it('www.test.com?kitty@supercute.com', () => {
        // URL: www.test.com?kitty@supercute.com => @ is valid when it is after ?
        let link = 'www.test.com?kitty@supercute.com';
        runMatchTestWithValidLink(link, {
            scheme: 'http',
            originalUrl: link,
            normalizedUrl: 'http://' + link,
        });
    });

    it('http://www.test.com/kitty@supercute.com', () => {
        // URL: http://www.test.com/kitty@supercute.com @ is valid when it is after / for URL that has http:// prefix
        let link = 'http://www.test.com/kitty@supercute.com';
        runMatchTestWithValidLink(link, { scheme: 'http', originalUrl: link, normalizedUrl: link });
    });
});

describe('defaultLinkMatchRules invalid http links with % and @ in URL', () => {
    it('http://www.test%00it.com/', () => {
        // %00 is invalid percent encoding
        runMatchTestWithBadLink('http://www.test%00it.com/');
    });

    it('http://www.test%hhit.com/', () => {
        // %h is invalid percent encoding
        runMatchTestWithBadLink('http://www.test%hhit.com/');
    });

    it('www.test%0hit.com/', () => {
        // %0 is invalid percent encoding
        runMatchTestWithBadLink('www.test%0hit.com/');
    });

    it('www.kitty@supercute.com.com/test', () => {
        // @ is invalid when it apperas before /
        runMatchTestWithBadLink('www.kitty@supercute.com.com/test');
    });

    it('www.kitty@supercute.com.com?test', () => {
        // @ is invalid when it apperas before ?
        runMatchTestWithBadLink('www.kitty@supercute.com.com?test');
    });

    it('https' + '://www.kitty@supercute.com.com/test', () => {
        // @ is invalid when it apperas before /. Note we're testing @ after http:// and before first /
        runMatchTestWithBadLink('https' + '://www.kitty@supercute.com.com/test');
    });
});

describe('defaultLinkMatchRules exact match with extra space and text', () => {
    it('www.bing.com more', () => {
        // exact match should not match since there is some space and extra text after the url
        runMatchTestWithBadLink('www.bing.com more');
    });
});

describe('defaultLinkmatchRules does not match invalid urls', () => {
    it('www.bing,com', () => {
        runMatchTestWithBadLink('www.bing,com');
    });

    it('www.b,,au', () => {
        runMatchTestWithBadLink('www.b,,au');
    });
});

describe('defaultLinkMatchRules other protocols, mailto, notes, file etc.', () => {
    it('mailto:someone@example.com', () => {
        let link = 'mailto:someone@example.com';
        runMatchTestWithValidLink(link, {
            scheme: 'mailto',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('notes://Garth/86256EDF005310E2/A4D87D90E1B19842852564FF006DED4E/', () => {
        let link = 'notes://Garth/86256EDF005310E2/A4D87D90E1B19842852564FF006DED4E/';
        runMatchTestWithValidLink(link, {
            scheme: 'notes',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('file://hostname/path/to/the%20file.txt', () => {
        let link = 'file://hostname/path/to/the%20file.txt';
        runMatchTestWithValidLink(link, { scheme: 'file', originalUrl: link, normalizedUrl: link });
    });

    it('\\\\fileserver\\SharedFolder\\Resource', () => {
        let link = '\\\\fileserver\\SharedFolder\\Resource';
        runMatchTestWithValidLink(link, { scheme: 'unc', originalUrl: link, normalizedUrl: link });
    });

    it('ftp://test.com/share', () => {
        let link = 'ftp://test.com/share';
        runMatchTestWithValidLink(link, { scheme: 'ftp', originalUrl: link, normalizedUrl: link });
    });

    it('ftp.test.com/share', () => {
        let link = 'ftp.test.com/share';
        runMatchTestWithValidLink(link, {
            scheme: 'ftp',
            originalUrl: link,
            normalizedUrl: 'ftp://' + link,
        });
    });

    it('news://news.server.example/example', () => {
        let link = 'news://news.server.example/example';
        runMatchTestWithValidLink(link, { scheme: 'news', originalUrl: link, normalizedUrl: link });
    });

    it('telnet://test.com:25', () => {
        let link = 'telnet://test.com:25';
        runMatchTestWithValidLink(link, {
            scheme: 'telnet',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('gopher://test.com/share', () => {
        let link = 'gopher://test.com/share';
        runMatchTestWithValidLink(link, {
            scheme: 'gopher',
            originalUrl: link,
            normalizedUrl: link,
        });
    });

    it('wais://testserver:2000/DB1', () => {
        let link = 'wais://testserver:2000/DB1';
        runMatchTestWithValidLink(link, { scheme: 'wais', originalUrl: link, normalizedUrl: link });
    });
});
