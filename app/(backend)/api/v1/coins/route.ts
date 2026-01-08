import { NextResponse } from 'next/server';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { CryptoCurrency } from '@/interfaces/CryptoCurrency';
import { roundOffNumber } from '@/services/utils.service';

const binanceApiProperties = axios.create({
    baseURL: 'https://api.binance.com/api/',
    headers: {
        accept: 'application/json'
    }
})

const coinGeckoApiProperties = axios.create({
    baseURL: 'https://api.coingecko.com/api/',
    headers: {
        'accept': 'application/json',
        'x-cg-demo-api-key': process.env.COIN_GECKO_API_KEY
    }
})


interface MasterSymbol {
    symbol: string,
    quoteAsset: string
}

export function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');

    if (!mode) {
        return NextResponse.json({
            error: 'Mode parameter is missing',
            status: 500
        })
    }

    if (mode === 'all') {
        return getAllCryptoCurrencies(searchParams);

    } else if (mode === 'paginated') {
        return getCryptoCurrencyListByPage(searchParams);
    }
}

async function getCryptoCurrencyListByPage(searchParams: URLSearchParams) {
    if (!process.env.COIN_GECKO_API_KEY) {
        return NextResponse.json({
            error: 'API key is missing',
            status: 500
        })
    }

    const queryParameters = {
        vs_currency: 'usd',
        symbols: searchParams.get('symbols') ? searchParams.get('symbols') : null,
        page: searchParams.get('page') ? searchParams.get('page') : 1,
        per_page: searchParams.get('perPage') ? searchParams.get('perPage') : '20'
    }

    try {
        const response = await coinGeckoApiProperties.get('v3/coins/markets', { params: queryParameters });
        return NextResponse.json(response.data);

    } catch (error) {
        return handleApiError(error);
    }
}

async function getAllCryptoCurrencies(searchParams: URLSearchParams) {
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
        return NextResponse.json({ data: createCryptoCurrencyList(masterSymbolList, cryptoPriceList) });

    } catch (error) {
        return handleApiError(error);
    }
}

function handleApiError(error: unknown) {
    if (axios.isAxiosError(error)) {
        return NextResponse.json(
            {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            },
            { status: error.response?.status ?? 500 }
        )
    }

    if (error instanceof Error) {
        return NextResponse.json(
            {
                message: error.message,
                status: 500,
            }
        )
    }

    return NextResponse.json(
        {
            message: 'Unknown error occurred',
            status: 500
        }
    )
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
                id: randomUUID(),
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
