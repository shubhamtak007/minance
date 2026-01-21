import MarketSummary from "@/components/features/MarketSummary";
import CoinList from "@/components/features/coins/coin-list";

export default function Home() {
    return (
        <div className="f-container">
            <MarketSummary />
            <CoinList />
        </div>
    );
}
