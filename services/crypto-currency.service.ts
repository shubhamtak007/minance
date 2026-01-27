import axios from 'axios';
import { CryptoCurrency } from '@/interfaces/crypto-currency';
import { roundOffNumber } from '@/services/utils.service';

interface MasterSymbol {
    symbol: string,
    quoteAsset: string
}

const binanceApiProperties = axios.create({
    baseURL: 'https://api.binance.com/api/',
    headers: {
        accept: 'application/json'
    }
})

const retrieveCoinList = async (apiParams: unknown) => {
    try {
        const response = await axios.get('api/v1/coins', { params: apiParams });
        return response;
    } catch (error) {
        throw error;
    } finally {

    }
}

const retrieveTrendingCoins = async () => {
    try {
        const response = await axios.get('api/v1/trending');
        return response.data.coins;
    } catch (error) {
        throw error;
    } finally {

    }
}

const retrieveGlobalMarketData = async () => {
    try {
        const response = await axios.get('api/v1/globalMarket');
        return response.data.data;
    } catch (error) {
        throw error;
    } finally {

    }
}

const retrieveAllCoins = async () => {
    const queryParameters = {
        symbolStatus: 'TRADING'
    }

    try {
        const promises = [
            binanceApiProperties.get('v3/exchangeInfo', { params: queryParameters }),
            binanceApiProperties.get('v3/ticker/24hr', { params: queryParameters })
        ]

        const responses = await Promise.all(promises);
        const masterSymbolList = responses[0].data.symbols.filter((symbol: MasterSymbol) => {
            return symbol.quoteAsset === 'USDT' && !symbol.symbol.includes('WBTC')
        });

        const cryptoPriceList = responses[1].data;
        return createCryptoCurrencyList(masterSymbolList, cryptoPriceList);

    } catch (error) {
        throw error;
    }
}

function createCryptoCurrencyList(masterSymbolList: MasterSymbol[], cryptoPriceList: CryptoCurrency[]) {
    let cryptoCurrencyList = [];

    for (const masterSymbol of masterSymbolList) {
        let symbolWithoutUSDT;

        const matchedCrypto = cryptoPriceList.find((cryptoPrice: CryptoCurrency) => {
            return cryptoPrice.symbol === masterSymbol.symbol
        })

        const symbols = matchedCrypto ? matchedCrypto.symbol.split('USDT') : [];

        for (const symbol of symbols) {
            if (symbol.length > 0) symbolWithoutUSDT = symbol;
        }

        if (matchedCrypto) {
            cryptoCurrencyList.push({
                id: self.crypto.randomUUID(),
                symbol: symbolWithoutUSDT,
                lastPrice: roundOffNumber(Number(matchedCrypto.lastPrice), 5),
                priceChange: roundOffNumber(Number(matchedCrypto.priceChange), 5),
                priceChangePercent: roundOffNumber(Number(matchedCrypto.priceChangePercent), 2),
                volume: Number(matchedCrypto.volume),
                quoteVolume: Number(matchedCrypto.quoteVolume),
                weightedAvgPrice: Number(matchedCrypto.weightedAvgPrice),
                count: matchedCrypto.count
            })
        }
    }

    return cryptoCurrencyList;
}


export { retrieveCoinList, retrieveTrendingCoins, retrieveGlobalMarketData, retrieveAllCoins }