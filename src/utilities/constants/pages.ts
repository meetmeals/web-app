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
    profile: {
        descriptionTransKey: 'pages.profileDescription',
        path: '/profile',
        transKey: 'pages.profile',
    },
    paymentResult: {
        descriptionTransKey: 'pages.paymentResult',
        path: '/payment-result',
        transKey: 'pages.paymentResult',
    },
};
