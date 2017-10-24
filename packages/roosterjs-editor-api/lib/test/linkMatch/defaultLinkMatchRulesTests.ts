import defaultLinkMatchRules from '../../linkMatch/defaultLinkMatchRules';
import matchLink from '../../linkMatch/matchLink';
import { LinkData, LinkMatchOption } from 'roosterjs-editor-types';

function runMatchTestWithValidLink(
    link: string,
    expected: LinkData,
    matchOption: LinkMatchOption
): void {
    let resultData = matchLink(link, matchOption, defaultLinkMatchRules);
    expect(resultData).not.toBe(null);
    expect(resultData.scheme).toBe(expected.scheme);
    expect(resultData.prefix).toBe(expected.prefix);
    expect(resultData.originalUrl).toBe(expected.originalUrl);
    expect(resultData.normalizedUrl).toBe(expected.normalizedUrl);
}

function runMatchTestWithBadLink(link: string, matchOption: LinkMatchOption): void {
    let linkData = matchLink(link, matchOption, defaultLinkMatchRules);
    expect(linkData).toBeNull();
}

describe('defaultLinkMatchRules regular http links with extact match', () => {
    it('http://www.bing.com', () => {
        let link = 'http://www.bing.com';
        runMatchTestWithValidLink(
            link,
            { scheme: 'http', prefix: 'http://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('http://www.bing.com/', () => {
        let link = 'http://www.bing.com/';
        runMatchTestWithValidLink(
            link,
            { scheme: 'http', prefix: 'http://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('http://www.lifewire.com/how-torrent-downloading-works-2483513', () => {
        let link = 'http://www.lifewire.com/how-torrent-downloading-works-2483513';
        runMatchTestWithValidLink(
            link,
            { scheme: 'http', prefix: 'http://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });
});

describe('defaultLinkMatchRules regular www links with extact match', () => {
    it('www.eartheasy.com/grow_compost.html', () => {
        let link = 'www.eartheasy.com/grow_compost.html';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });
});

describe('defaultLinkMatchRules regular https links with extact match', () => {
    it('https://en.wikipedia.org/wiki/Compost', () => {
        let link = 'https://en.wikipedia.org/wiki/Compost';
        runMatchTestWithValidLink(
            link,
            { scheme: 'https', prefix: 'https://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('https://www.youtube.com/watch?v=e3Nl_TCQXuw', () => {
        let link = 'https://www.youtube.com/watch?v=e3Nl_TCQXuw';
        runMatchTestWithValidLink(
            link,
            { scheme: 'https', prefix: 'https://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('https://www.bing.com/news/search?q=MSFT&qpvt=msft&FORM=EWRE', () => {
        let link = 'https://www.bing.com/news/search?q=MSFT&qpvt=msft&FORM=EWRE';
        runMatchTestWithValidLink(
            link,
            { scheme: 'https', prefix: 'https://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('https://microsoft.sharepoint.com/teams/peopleposse/Shared%20Documents/Feedback%20Plan.pptx?web=1', () => {
        let link =
            'https://microsoft.sharepoint.com/teams/peopleposse/Shared%20Documents/Feedback%20Plan.pptx?web=1';
        runMatchTestWithValidLink(
            link,
            { scheme: 'https', prefix: 'https://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });
});

describe('defaultLinkMatchRules special http links that has % and @, but is valid', () => {
    it('www.test%20it.com/', () => {
        // URL: www.test%20it.com/ => %20 is a valid percent encoding
        let link = 'www.test%20it.com/';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });

    it('www.test%20it%20.com/', () => {
        // URL: www.test%20it%20.com/ => test two %20 in a row
        let link = 'www.test%20it%20.com/';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });

    it('www.test.com/?test=test%00it', () => {
        // URL: www.test.com/?test=test%00it %00 => %00 is invalid percent encoding but URL is valid since it is after ?
        let link = 'www.test.com/?test=test%00it';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });

    it('http://www.test.com/?test=test%hhit', () => {
        // URL: http://www.test.com/?test=test%hhit => %h is invalid encoding, but URL is valid since it is after ?
        let link = 'http://www.test.com/?test=test%hhit';
        runMatchTestWithValidLink(
            link,
            { scheme: 'http', prefix: 'http://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('www.test.com/kitty@supercute.com', () => {
        // URL: www.test.com/kitty@supercute.com => @ is valid when it is after /
        let link = 'www.test.com/kitty@supercute.com';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });

    it('www.test.com?kitty@supercute.com', () => {
        // URL: www.test.com?kitty@supercute.com => @ is valid when it is after ?
        let link = 'www.test.com?kitty@supercute.com';
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: link,
                normalizedUrl: 'http://' + link,
            },
            LinkMatchOption.Exact
        );
    });

    it('http://www.test.com/kitty@supercute.com', () => {
        // URL: http://www.test.com/kitty@supercute.com @ is valid when it is after / for URL that has http:// prefix
        let link = 'http://www.test.com/kitty@supercute.com';
        runMatchTestWithValidLink(
            link,
            { scheme: 'http', prefix: 'http://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });
});

describe('defaultLinkMatchRules invalid http links with % and @ in URL', () => {
    it('http://www.test%00it.com/', () => {
        // %00 is invalid percent encoding
        runMatchTestWithBadLink('http://www.test%00it.com/', LinkMatchOption.Exact);
    });

    it('http://www.test%hhit.com/', () => {
        // %h is invalid percent encoding
        runMatchTestWithBadLink('http://www.test%hhit.com/', LinkMatchOption.Exact);
    });

    it('www.test%0hit.com/', () => {
        // %0 is invalid percent encoding
        runMatchTestWithBadLink('www.test%0hit.com/', LinkMatchOption.Exact);
    });

    it('www.kitty@supercute.com.com/test', () => {
        // @ is invalid when it apperas before /
        runMatchTestWithBadLink('www.kitty@supercute.com.com/test', LinkMatchOption.Exact);
    });

    it('www.kitty@supercute.com.com?test', () => {
        // @ is invalid when it apperas before ?
        runMatchTestWithBadLink('www.kitty@supercute.com.com?test', LinkMatchOption.Exact);
    });

    it('https' + '://www.kitty@supercute.com.com/test', () => {
        // @ is invalid when it apperas before /. Note we're testing @ after http:// and before first /
        runMatchTestWithBadLink(
            'https' + '://www.kitty@supercute.com.com/test',
            LinkMatchOption.Exact
        );
    });
});

describe('defaultLinkMatchRules exact match with extra space and text', () => {
    it('www.bing.com more', () => {
        // exact match should not match since there is some space and extra text after the url
        runMatchTestWithBadLink('www.bing.com more', LinkMatchOption.Exact);
    });
});

describe('defaultLinkMatchRules partial match with extra space', () => {
    it('http://www.bing.com more', () => {
        let link = 'http://www.bing.com more';
        let matchedLink = 'http://www.bing.com';
        // It should match since it is a partial match
        runMatchTestWithValidLink(
            link,
            {
                scheme: 'http',
                prefix: 'http://',
                originalUrl: matchedLink,
                normalizedUrl: matchedLink,
            },
            LinkMatchOption.Partial
        );
    });
});

describe('defaultLinkMatchRules other protocols, mailto, notes, file etc.', () => {
    it('mailto:someone@example.com', () => {
        let link = 'mailto:someone@example.com';
        runMatchTestWithValidLink(
            link,
            { scheme: 'mailto', prefix: 'mailto:', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('notes://Garth/86256EDF005310E2/A4D87D90E1B19842852564FF006DED4E/', () => {
        let link = 'notes://Garth/86256EDF005310E2/A4D87D90E1B19842852564FF006DED4E/';
        runMatchTestWithValidLink(
            link,
            { scheme: 'notes', prefix: 'notes://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('file://hostname/path/to/the%20file.txt', () => {
        let link = 'file://hostname/path/to/the%20file.txt';
        runMatchTestWithValidLink(
            link,
            { scheme: 'file', prefix: 'file://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('\\\\fileserver\\SharedFolder\\Resource', () => {
        let link = '\\\\fileserver\\SharedFolder\\Resource';
        runMatchTestWithValidLink(
            link,
            { scheme: 'unc', prefix: '\\\\', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('ftp://test.com/share', () => {
        let link = 'ftp://test.com/share';
        runMatchTestWithValidLink(
            link,
            { scheme: 'ftp', prefix: 'ftp://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('ftp.test.com/share', () => {
        let link = 'ftp.test.com/share';
        runMatchTestWithValidLink(
            link,
            { scheme: 'ftp', prefix: 'ftp://', originalUrl: link, normalizedUrl: 'ftp://' + link },
            LinkMatchOption.Exact
        );
    });

    it('news://news.server.example/example', () => {
        let link = 'news://news.server.example/example';
        runMatchTestWithValidLink(
            link,
            { scheme: 'news', prefix: 'news://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('telnet://test.com:25', () => {
        let link = 'telnet://test.com:25';
        runMatchTestWithValidLink(
            link,
            { scheme: 'telnet', prefix: 'telnet://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('gopher://test.com/share', () => {
        let link = 'gopher://test.com/share';
        runMatchTestWithValidLink(
            link,
            { scheme: 'gopher', prefix: 'gopher://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });

    it('wais://testserver:2000/DB1', () => {
        let link = 'wais://testserver:2000/DB1';
        runMatchTestWithValidLink(
            link,
            { scheme: 'wais', prefix: 'wais://', originalUrl: link, normalizedUrl: link },
            LinkMatchOption.Exact
        );
    });
});
