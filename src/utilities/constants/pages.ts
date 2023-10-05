type PageData = {
    alias?: string;
    descriptionTransKey?: string;
    path: string;
    transKey: string;
};

export const pages: { [key: string]: PageData } = {
    contactUs: {
        descriptionTransKey: 'pages.contactUsDescription',
        path: '/contact-us',
        transKey: 'pages.contactUs',
    },
    explore: {
        alias: '/explore',
        descriptionTransKey: 'pages.exploreDescription',
        path: '/',
        transKey: 'pages.explore',
    },
    packages: {
        descriptionTransKey: 'pages.packagesDescription',
        path: '/packages',
        transKey: 'pages.packages',
    },
    paymentResult: {
        descriptionTransKey: 'pages.paymentResultDescription',
        path: '/payment-result',
        transKey: 'pages.paymentResult',
    },
    account: {
        descriptionTransKey: 'pages.accountDescription',
        path: '/account',
        transKey: 'pages.account',
    },
};
