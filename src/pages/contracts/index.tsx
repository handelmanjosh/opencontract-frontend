import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { generateKey } from '../../components/utils/sol';
import { useWallet } from '@solana/wallet-adapter-react';

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
export default function Contracts() {
    const [contracts, setContracts] = useState<any[]>([]);
    const { publicKey, signTransaction } = useWallet();
    const [sendingContract, setSendingContract] = useState<boolean>(false); // do not include in post request

    useEffect(() => {
        fetch("http://localhost:3005/public").then(response => {
            if (response.status == 200) {
                response.json().then(json => {
                    const { events } = json;
                    console.log(events);
                    setContracts(events);

                });
            } else {
                console.error("Failed");
            }
        });
    }, []);
    const claimContract = (id: string) => {

        if (publicKey) {
            setSendingContract(true);
            fetch("http://localhost:3005/claim",
                {
                    method: "POST",
                    body: JSON.stringify({
                        address: publicKey.toBase58(),
                        id,
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            ).then(response => {
                if (response.status === 200) {
                    console.log("ok");
                } else {
                    console.log("not ok");
                }
            }).catch(err => console.error(err)).finally(() => setSendingContract(false));
        }
    };
    return (
        <div className="relative w-auto h-auto flex flex-col justify-start items-center">
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
            <div className="grid grid-cols-5 grid-rows-10 place-items-center items-center gap-4">
                {contracts && contracts.length > 0 ?
                    <>
                        {contracts.map((contract, i: number) => {
                            return (
                                <Contract {...contract} claimContract={claimContract} key={i} />
                            );
                        })

                        }
                    </>
                    :
                    <></>
                }
            </div>
            {sendingContract ?
                <div className="absolute top-0 left-0 w-full h-full bg-slate-600/60 flex justify-center items-center">
                    <Spinner />
                </div>
                :
                <></>
            }
        </div>
    );
}
function Spinner() {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
        </div>
    );
};

type ContractProps = {
    amount: number;
    tokenAddress: string;
    reward: number;
    rewardTokenAddress: string;
    numberOfContracts: number;
    claimContract: (id: string) => any;
    id: string;
};
function Contract({ amount, tokenAddress, reward, rewardTokenAddress, numberOfContracts, claimContract, id }: ContractProps) {
    return (
        <div>
            <div className="w-52 h-full flex flex-col justify-center items-center bg-slate-800 rounded-lg gap-2 p-4">
                <div className="w-full flex flex-row justify-center items-center gap-1">
                    <div className="flex flex-col justify-center items-center w-[50%]">
                        <p>Collect</p>
                        <p>{amount}</p>
                        <p>{shortenAddress(tokenAddress)}</p>
                    </div>
                    <RightArrow size={6} />
                    <div className="flex flex-col justify-center items-center w-[50%]">
                        <p>Recieve</p>
                        <p>{reward}</p>
                        <p>{shortenAddress(rewardTokenAddress)}</p>
                    </div>
                </div>
                <button onClick={() => claimContract(id)} className="bg-yellow-500 rounded-lg hover:brightness-90 active:brightness-75 py-2 px-8">Claim</button>
                <p className="text-center w-full text-lg"><span className="font-bold">{`${numberOfContracts}`}</span> {'remaining'}</p>
            </div>
        </div>
    );
}
function shortenAddress(address: string) {
    return `${address.substring(0, 4)}..${address.substring(address.length - 3, address.length)}`;
}
const LeftArrow = ({ size }: { size: number; }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={`h-${size} w-${size}`}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
    </svg>
);

const RightArrow = ({ size }: { size: number; }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className={`h-${size} w-${size} transform rotate-180`}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
    </svg>
);