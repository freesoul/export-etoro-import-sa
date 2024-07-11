
// Symbols as in Etoro to ignore in the export
const ETORO_IGNORE = ["NVTKL.L"]

// Symbols mapping to transform from Etoro to SA
const ETORO_TO_SA_MAPPING: EtoroToSASymbolMapping = {
    "BA.L": {
        sa_name: "BAESY",
        conversion_rate: 71.24 / 1384,
    },
    "JD.US": {
        sa_name: "JD",
        conversion_rate: 1,
    },
    "RR.L": {
        sa_name: "RYCEY",
        conversion_rate: 5.63 / 442.1358,
    },
    "STLA.US": {
        sa_name: "STLA",
        conversion_rate: 1,
    },
    "VOW3.DE": {
        sa_name: "VWAGY",
        conversion_rate: 15.08 / 120.72,
    },
    "JASMY": {
        sa_name: "JASMY-USD",
        conversion_rate: 1,
    },
};


// Config end

interface MappingEntry {
    sa_name: string;
    conversion_rate: number;
}

interface EtoroToSASymbolMapping {
    [key: string]: MappingEntry;
}

export { ETORO_TO_SA_MAPPING, ETORO_IGNORE, EtoroToSASymbolMapping, MappingEntry };

