const ETORO_TO_SA_MAPPING = {
    "BA.L": {
        sa_name: "BAESY",
        conversion_rate: 71.24 / 1384,
    },
};
function mapEtoroToSASymbol(sa_symbol) {
    return ETORO_TO_SA_MAPPING[sa_symbol];
}
export { ETORO_TO_SA_MAPPING, mapEtoroToSASymbol };
