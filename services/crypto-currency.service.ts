import axios from 'axios';

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

export { retrieveCoinList, retrieveTrendingCoins, retrieveGlobalMarketData }