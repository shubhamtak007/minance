import { NextResponse } from 'next/server';
import axios from 'axios';

const apiProperties = axios.create({
    baseURL: 'https://api.coingecko.com/api/',
    headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.COIN_GECKO_API_KEY
    }
})

export async function GET(request: Request) {
    if (!process.env.COIN_GECKO_API_KEY) {
        NextResponse.json({
            error: 'API key is missing',
            status: 500
        })
    }

    const { searchParams } = new URL(request.url);

    const queryParameters = {

    }

    try {
        const endPoint = 'v3/search/trending';
        const response = await apiProperties.get(endPoint, { params: queryParameters });
        return NextResponse.json(response.data);

    } catch (error: unknown) {
        debugger;
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
            debugger;
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
}