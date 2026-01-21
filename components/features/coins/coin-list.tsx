'use client';

import useCoinList from '@/hooks/useCoinList';
import DataTable from '@/components/features/coins/data-table';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { columns } from '@/components/features/coins/columns';
import type { CoingeckoCrypto } from '@/interfaces/CryptoCurrency';

function CoinList() {
    let [currentPageNumber, setCurrentPageNumber] = useState(1);
    const { fetchingCoinList, coinList } = useCoinList({ currentPageNumber });

    return (
        <>
            <DataTable<CoingeckoCrypto>
                list={coinList}
                columns={columns}
                listEmptyMessage={'No coins found.'}
                fetchingList={fetchingCoinList}
                currentPageNumber={currentPageNumber}
            />

            <div className="pagination-btn-group space-x-2 mt-[12px] text-center">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setCurrentPageNumber(currentPageNumber - 1) }}
                    disabled={(currentPageNumber === 1 || fetchingCoinList)}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setCurrentPageNumber((prev) => prev + 1) }}
                    disabled={(coinList.length === 0 || fetchingCoinList)}
                >
                    Next
                </Button>
            </div>
        </>
    )
}

export default CoinList;