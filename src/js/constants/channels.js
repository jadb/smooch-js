import isMobile from 'ismobilejs';

import { integrations as integrationsAssets } from '../constants/assets';

import { fetchWeChatQRCode } from '../services/integrations-service';

import { MessengerChannelContent } from '../components/channels/messenger-channel-content';
import { EmailChannelContent } from '../components/channels/email-channel-content';
import { TwilioChannelContent } from '../components/channels/twilio-channel-content';
import { WeChatChannelContent } from '../components/channels/wechat-channel-content';
import { LineChannelContent } from '../components/channels/line-channel-content';

export const CHANNEL_DETAILS = {
    messenger: {
        name: 'Facebook Messenger',
        descriptionKey: 'messengerChannelDescription',
        isLinkable: true,
        ...integrationsAssets.messenger,
        Component: MessengerChannelContent,
        getURL: (appUser, channel) => `https://m.me/${channel.pageId}`
    },
    frontendEmail: {
        name: 'Email',
        descriptionKey: 'frontendEmailChannelDescription',
        isLinkable: false,
        ...integrationsAssets.frontendEmail,
        Component: EmailChannelContent
    },
    twilio: {
        name: 'SMS',
        descriptionKey: 'smsChannelDescription',
        isLinkable: false,
        ...integrationsAssets.sms,
        Component: TwilioChannelContent
    },
    telegram: {
        name: 'Telegram',
        descriptionKey: 'telegramChannelDescription',
        isLinkable: true,
        ...integrationsAssets.telegram,
        getURL: (appUser, channel, linked) => `https://telegram.me/${channel.username}${!linked ? '?start=' + appUser._id : ''}`
    },
    wechat: {
        name: 'WeChat',
        descriptionHtmlKey: isMobile.any ? 'wechatChannelDescriptionMobile' : 'wechatChannelDescription',
        isLinkable: true,
        ...integrationsAssets.wechat,
        Component: WeChatChannelContent,
        onChannelPage: fetchWeChatQRCode,
        renderPageIfLinked: true
    },
    line: {
        name: 'LINE',
        descriptionKey: 'lineChannelDescription',
        isLinkable: false,
        ...integrationsAssets.line,
        Component: LineChannelContent
    }
};

Object.keys(CHANNEL_DETAILS).forEach((key) => {
    CHANNEL_DETAILS[key] = {
        renderPageIfLinked: false,
        getURL: () => {},
        onChannelPage: () => Promise.resolve(),
        ...CHANNEL_DETAILS[key]
    };
});
