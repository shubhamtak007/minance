import { use } from 'react';

function CoinDetails({ params, }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);

    return (
        <></>
    )
}

export default CoinDetails;