import { use } from 'react';

function CoinDetails({ params, }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);

    console.log(symbol)

    return (
        <></>
    )
}

export default CoinDetails;