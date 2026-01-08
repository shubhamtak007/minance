import MarketSummary from "@/components/features/MarketSummary";
import CoinList from "@/components/features/CoinList";

export default function Home() {
    return (
        <div className="f-container">
            <MarketSummary />
            <CoinList />
        </div>
    );
}
