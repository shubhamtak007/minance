'use client';

import useCoinList from '@/hooks/useCoinList';
import DataTable from '@/components/features/coins/data-table';
import React, { useState, useRef } from 'react';
import type { CoingeckoCrypto } from '@/interfaces/CryptoCurrency';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Search } from 'lucide-react';
import { getItemsPerPage } from '@/services/utils.service';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/features/coins/columns';

function CoinList() {
    let [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState<string>('');
    const { fetchingCoinList, coinList } = useCoinList({ currentPageNumber, searchValue });

    function onSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentPageNumber(1);
        setSearchValue(event.target.value);
    }

    return (
        <>
            <div className="coins-sst-container">
                <div className="search-bar">
                    <InputGroup className="max-w-xs search-input-group">
                        <InputGroupInput
                            placeholder="Search Coin Name"
                            value={searchValue}
                            onChange={(event) => { onSearchInputChange(event) }}
                            disabled={fetchingCoinList}
                        />

                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>

                <DataTable<CoingeckoCrypto>
                    list={coinList}
                    columns={columns}
                    listEmptyMessage={'No coins found.'}
                    fetchingList={fetchingCoinList}
                    currentPageNumber={currentPageNumber}
                />

                <div className="pagination-btn-group space-x-2 m-[12px] text-center">
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
                        disabled={(coinList.length < getItemsPerPage() || fetchingCoinList)}
                    >
                        Next
                    </Button>
                </div>
            </div >
        </>
    )
}

export default CoinList;