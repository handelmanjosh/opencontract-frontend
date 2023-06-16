import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Home: NextPage = () => {
    const wallet = useAnchorWallet();
    const router = useRouter();
    return (
        <div className="w-screen h-screen flex flex-col justify-start items-center">
            <div className="flex flex-row items-center justify-between w-full h-auto p-4">
                <div className="w-auto h-auto p-4 border-8 border-white">
                    <p className="text-6xl">OpenContract</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-2">
                    <div className='w-auto h-auto bg-purple-800 rounded-md'>
                        <WalletMultiButtonDynamic />
                    </div>
                    <div className="w-auto h-auto bg-purple-800 rounded-md">
                        <WalletDisconnectButtonDynamic />
                    </div>
                </div>
            </div>
            <div className="w-full flex-grow flex flex-col justify-center items-center gap-4 bg-gradient-to-tr from-white via-transparent to-transparent">
                <p className="text-3xl">Track any on chain event</p>
                <div className="relative flex items-center justify-center w-auto h-40">
                    <div className="flex justify-center items-center w-auto h-auto border-white border-2 p-2 hover:p-0 transition-all duration-300">
                        <button className="py-6 px-24 text-3xl bg-white text-black" onClick={() => router.push("/create")}>
                            Try it now...
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
