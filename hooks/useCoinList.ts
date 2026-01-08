'use client';

import { useEffect, useState } from 'react';
import { retrieveCoinList } from '@/services/crypto-currency.service';
import type { CoingeckoCrypto } from '@/interfaces/CryptoCurrency';

interface CoinListHookProps {
    currentPageNumber: number
}

function useCoinList({ currentPageNumber }: CoinListHookProps) {
    const [coinList, setCoinList] = useState<CoingeckoCrypto[]>([]);
    const [fetchingCoinList, setFetchingCoinList] = useState<boolean>(false);

    useEffect(() => {
        fetchCoins();
    }, [currentPageNumber])

    const fetchCoins = async () => {
        setFetchingCoinList(true);

        const params = {
            page: currentPageNumber,
            perPage: 10
        }

        try {
            const response = await retrieveCoinList(params);
            setCoinList((response && response.data) ? response.data : []);
        } catch (error) {

        } finally {
            setFetchingCoinList(false);
        }
    }

    return { coinList, fetchingCoinList };
}

export default useCoinList;