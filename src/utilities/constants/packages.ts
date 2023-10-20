export const PackageViewStatus: {
    [key: string]: { transKey: string; color: string };
} = {
    1: { transKey: 'app.finishedInFirstHour', color: '#B8B8B8' },
    2: { transKey: 'app.finished', color: '#B8B8B8' },
    3: { transKey: 'app.lessThanFive', color: '#FFCA1D' },
    4: { transKey: 'app.moreThanFive', color: '#45A132' },
    5: { transKey: 'app.lastChance', color: '#FF7072' },
    6: { transKey: 'app.saleFinished', color: '#B8B8B8' },
};
