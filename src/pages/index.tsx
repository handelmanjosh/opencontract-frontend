import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import ImageText from '../components/ImageText';
import PrettyText from '../components/PrettyText';
import TitleText from '../components/TitleText';
import TextText from '../components/TextText';
import { getMyBase58Pubkey, receiveSol, sendSol } from '../components/utils/sol';

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const Home: NextPage = () => {
    const { publicKey, signTransaction } = useWallet();
    const router = useRouter();
    return (
        <div className="w-auto h-auto flex flex-col justify-start items-center">
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
                    {/* <button onClick={generateKey}>Generate Key</button> */}
                    {/* <button onClick={() => receiveSol(publicKey?.toBase58()!, 0.1, signTransaction!)}>Recieve some SOL</button>
                    <button onClick={() => sendSol(0.05, publicKey?.toBase58()!)}>Send some SOL</button>
                    <button onClick={getMyBase58Pubkey}>Get my pubkey</button> */}
                </div>
            </div>
            <div className="w-full flex-grow flex flex-col gap-10 justify-center items-center">
                <div className="flex flex-col justify-center items-center w-[50%] gap-4 h-auto p-4">
                    <p className="text-left text-5xl font-bold text-transparent bg-clip-text p-1 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">{"What is OpenContract?"}</p>
                    <p className="text-left w-full text-2xl">{`OpenContract is a webapp built on the Solana blockchain that allows any user to easily track any on-chain events. Whether you're a game developer or a player, you can leverage OpenContract's powerful features to enhance your experience on Solana.`}</p>
                    <div className="flex flex-row justify-center items-center w-full">
                        <ImageText src="/game_development.jpeg" text="Implement web3 features with ease using OpenContract." title="Developers" />
                        <ImageText src="controller.webp" text="Challenge each other with bounties and make them public for all to see!" title="Players" />
                        <ImageText src="/code.jpeg" text="Track any on-chain events on Solana with OpenContract." title="Everyone" />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-[50%] gap-4 h-auto p-4">
                    <div className="w-full flex flex-row justify-start items-center text-5xl">
                        <PrettyText text="How does OpenContract Work with the Solana Blockchain?" />
                    </div>
                    <div className="w-full flex flex-row justify-start items-center">
                        <TitleText title="The Solana Ecosystem" text="OpenContract is deeply integrated with the Solana ecosystem, allowing developers to leverage web3 features and players to challenge each other with bounties." />
                        <TitleText title="The Fastest Blockchain" text="Solana is the fastest blockchain in the world, processing thousands of transactions per second. With OpenContract, you can track events in real-time with unmatched speed." />
                        <TitleText title="Secure and Scalable" text="OpenContract is built with security and scalability in mind. The webapp uses cutting-edge technology to ensure the safety and privacy of your data." />
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center w-[40%] gap-4 h-auto p-4">
                    <div className="w-full flex flex-row justify-start items-center text-5xl">
                        <PrettyText text="Tracking On-Chain Events" />
                    </div>
                    <p className="w-full text-left text-lg">
                        ChainTracker allows you to track any on-chain events on the Solana blockchain with ease. Whether {`you're`} interested in DeFi, gaming, or NFTs, ChainTracker has you covered.
                    </p>
                    <div className="grid grid-cols-2 grid-rows-2 place-items-center gap-4 items-center">
                        <TextText title="DeFi" text="Track your favorite tokens and DeFi projects." />
                        <TextText title="NFTs" text="Track sales and bids on your favorite NFT marketplaces." />
                        <TextText title="Gaming" text="Track leaderboard rankings and public bounties in your favorite games." />
                        <TextText title="More" text="Track any on-chain event on Solana with OpenContract." />
                    </div>
                </div>
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
