import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { receiveSol } from '../../components/utils/sol';
import { receiveTokens } from '../../components/utils/token';

const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
const availableTypes = ["Value", "Movement", "Bounty"];
export default function Create() {
    const [selectedType, setSelectedType] = useState<string>(availableTypes[0]);
    const [toAccount, setToAccount] = useState<string>("");
    const [fromAccount, setFromAccount] = useState<string>("");
    const [tokenAddress, setTokenAddress] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [reward, setReward] = useState<string>("");
    const [rewardTokenAddress, setRewardTokenAddress] = useState<string>("");
    const [isSol, setIsSol] = useState<boolean>(false);
    const [negative, setNegative] = useState<boolean>(false);
    const [isRewardSol, setIsRewardSol] = useState<boolean>(false);
    const [sendingContract, setSendingContract] = useState<boolean>(false); // do not include in post request
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [numberOfContracts, setNumberOfContracts] = useState<string>("");
    const { publicKey, signTransaction } = useWallet();

    useEffect(() => {
        resetAllState();
    }, [selectedType]);
    const submitContract = async () => {
        if (!publicKey || !signTransaction) return;
        if (!Number(amount) || !Number(reward)) return;

        let payReward = Number(reward);
        if (numberOfContracts !== "") {
            payReward *= Number(numberOfContracts);
        }
        if (isSol) {
            await receiveSol(publicKey.toBase58(), Number(payReward), signTransaction);
        } else {
            await receiveTokens(rewardTokenAddress, publicKey.toBase58(), Number(payReward), signTransaction);
        }

        setSendingContract(true);
        console.log("sending contract");

        fetch("http://localhost:3005/create",
            {
                method: "POST",
                body: JSON.stringify({
                    type: selectedType,
                    toAccount,
                    fromAccount,
                    tokenAddress,
                    amount,
                    reward,
                    rewardTokenAddress,
                    isRewardSol,
                    isSol,
                    negative,
                    isPublic,
                    numberOfContracts,
                    time: 7 // whatever
                }),
                headers: { "Content-Type": "application/json" }
            }
        ).then(response => {
            setSendingContract(false);
            if (response.status == 200) {
                response.json().then(data => {
                    console.log(data);
                });
                resetAllState();
            } else {
                console.error("Error creating contract");
            }
        }).catch(err => {
            setSendingContract(false);
            console.error(err);
        });
    };
    const resetAllState = () => {
        setToAccount("");
        setFromAccount("");
        setTokenAddress("");
        setAmount("");
        setReward("");
        setRewardTokenAddress("");
        setIsSol(false);
        setNegative(false);
        setIsRewardSol(false);
        setNumberOfContracts("");
    };

    return (
        <div className="relative h-screen w-screen flex flex-col justify-center items-center">
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
            <div className="w-full flex-grow flex flex-col justify-center items-center gap-4">
                <TrackedTypeBar func={(type: string) => setSelectedType(type)} selectedType={selectedType} />
                <div className="flex flex-col flex-grow justify-center items-center w-full">
                    {selectedType === "Value" ?
                        <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-6">
                            <p className="text-center text-4xl">{"Trigger event when balance within an account exceeds or falls below the target amount"}</p>
                            <div className="flex flex-row flex-grow justify-center items-center w-full h-full gap-6">
                                <div className="w-[30%] h-full flex flex-col justify-center items-center">
                                    <Panel>
                                        <div className="flex flex-col justify-center items-center flex-grow w-full h-full gap-4">
                                            <StyledInput
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToAccount(event.target.value)}
                                                value={toAccount}
                                                placeholder="Enter address to track"
                                                isError={false}
                                                label="Enter address to track"
                                            />
                                            <StyledInput
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(event.target.value)}
                                                value={tokenAddress}
                                                placeholder="Enter target token address"
                                                isError={false}
                                                label="Enter target token address"
                                                deactivated={isSol}
                                            />
                                            <SolCheckBox
                                                checked={isSol}
                                                text="Target token is SOL"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsSol(!isSol)}
                                            />
                                            <StyledInput
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
                                                value={amount}
                                                placeholder="Enter amount to track"
                                                isError={false}
                                                label="Enter amount to track"
                                            />
                                            <SolCheckBox
                                                checked={negative}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNegative(!negative)}
                                                text="Trigger when balance falls below amount"
                                            />
                                        </div>
                                    </Panel>
                                </div>
                                <div className="w-[30%] h-full flex flex-col justify-center items-center">
                                    <Panel>
                                        <div className="flex flex-col justify-center items-center flex-grow w-full h-full gap-4">
                                            <StyledInput
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReward(event.target.value)}
                                                value={reward}
                                                placeholder="Enter reward amount"
                                                isError={false}
                                                label="Enter reward amount"
                                            />
                                            <StyledInput
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRewardTokenAddress(event.target.value)}
                                                value={rewardTokenAddress}
                                                placeholder="Enter reward token address"
                                                isError={false}
                                                deactivated={isRewardSol}
                                                label="Enter reward token address"
                                            />
                                            <SolCheckBox
                                                checked={isRewardSol}
                                                text="Reward is in SOL"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsRewardSol(!isRewardSol)}
                                            />
                                            <SolCheckBox
                                                checked={isRewardSol}
                                                text="Is contract public?"
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsPublic(!isPublic)}
                                            />
                                        </div>
                                    </Panel>
                                </div>
                            </div>
                            <div className="flex flex-row justify-center items-center w-full">
                                <StyledButton onClick={submitContract} />
                            </div>
                        </div>
                        :
                        selectedType === "Movement" ?
                            <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-6">
                                <p className="text-center text-4xl">{"Trigger event when funds leave an account, enter an account, or move from one account to another"}</p>
                                <p className="text-center text-2xl">{"Fill in both addresses to track movement, fill in either one to tract subtraction or addition respectively"}</p>
                                <div className="flex flex-row flex-grow justify-center items-center w-full h-full gap-6">
                                    <div className="w-[30%] h-full flex flex-col justify-center items-center">
                                        <Panel>
                                            <div className="flex flex-col justify-center items-center w-full h-full gap-4">
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFromAccount(event.target.value)}
                                                    value={fromAccount}
                                                    placeholder="Enter address to track fund subtraction"
                                                    isError={false}
                                                    label="Enter address to track fund subtraction"
                                                />
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(event.target.value)}
                                                    value={tokenAddress}
                                                    placeholder="Enter target token address"
                                                    isError={false}
                                                    label="Enter target token address"
                                                    deactivated={isSol}
                                                />
                                                <SolCheckBox
                                                    checked={isSol}
                                                    text="Target token is SOL"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsSol(!isSol)}
                                                />
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
                                                    value={amount}
                                                    placeholder="Enter amount to track"
                                                    isError={false}
                                                    label="Enter amount to track"
                                                />
                                            </div>
                                        </Panel>
                                    </div>
                                    <div className="w-[30%] h-full flex flex-col justify-center items-center">
                                        <Panel>
                                            <div className="flex flex-col justify-center items-center w-full h-full gap-4">
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToAccount(event.target.value)}
                                                    value={toAccount}
                                                    placeholder="Enter address to track fund addition"
                                                    isError={false}
                                                    label="Enter address to track fund addition"
                                                />
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRewardTokenAddress(event.target.value)}
                                                    value={rewardTokenAddress}
                                                    placeholder="Enter reward token address"
                                                    isError={false}
                                                    deactivated={isRewardSol}
                                                    label="Enter reward token address"
                                                />
                                                <SolCheckBox
                                                    checked={isRewardSol}
                                                    text="Reward is in SOL"
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsRewardSol(!isRewardSol)}
                                                />
                                                <StyledInput
                                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReward(event.target.value)}
                                                    value={reward}
                                                    placeholder="Enter reward amount"
                                                    isError={false}
                                                    label="Enter reward amount"
                                                />
                                            </div>
                                        </Panel>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center items-center w-full">
                                    <StyledButton onClick={submitContract} />
                                </div>
                            </div>
                            : selectedType == "Bounty" ?
                                <div className="w-full h-full flex flex-col justify-center items-center p-4 gap-6">
                                    <p className="text-center text-4xl">{"Create a public bounty"}</p>
                                    <div className="flex flex-row flex-grow justify-center items-center w-full h-full gap-6">
                                        <div className="w-[30%] h-full flex flex-col justify-center items-center">
                                            <Panel>
                                                <div className="flex flex-col justify-center items-center w-full h-full gap-4">
                                                    <StyledInput
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNumberOfContracts(event.target.value)}
                                                        value={numberOfContracts}
                                                        placeholder="Enter number of contracts"
                                                        isError={false}
                                                        label="Enter number of contracts"
                                                    />
                                                    <StyledInput
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmount(event.target.value)}
                                                        value={amount}
                                                        placeholder="Enter amount to track"
                                                        isError={false}
                                                        label="Enter amount to track"
                                                    />
                                                    <SolCheckBox
                                                        checked={negative}
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNegative(!negative)}
                                                        text="Decrease in this amount?"
                                                    />
                                                    <StyledInput
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReward(event.target.value)}
                                                        value={reward}
                                                        placeholder="Enter reward amount"
                                                        isError={false}
                                                        label="Enter reward amount"
                                                    />
                                                    <StyledInput
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTokenAddress(event.target.value)}
                                                        value={tokenAddress}
                                                        placeholder="Enter target token address"
                                                        isError={false}
                                                        label="Enter target token address"
                                                        deactivated={isSol}
                                                    />
                                                    <SolCheckBox
                                                        checked={isSol}
                                                        text="Target token is SOL"
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsSol(!isSol)}
                                                    />
                                                    <StyledInput
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setRewardTokenAddress(event.target.value)}
                                                        value={rewardTokenAddress}
                                                        placeholder="Enter reward token address"
                                                        isError={false}
                                                        deactivated={isRewardSol}
                                                        label="Enter reward token address"
                                                    />
                                                    <SolCheckBox
                                                        checked={isRewardSol}
                                                        text="Reward is in SOL"
                                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setIsRewardSol(!isRewardSol)}
                                                    />
                                                </div>
                                            </Panel>
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-center items-center w-full">
                                        <StyledButton onClick={submitContract} />
                                    </div>
                                </div>
                                :
                                <></>
                    }
                </div>
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
function StyledButton({ onClick }: { onClick: () => any; }) {
    return (
        <div className="relative flex items-center justify-center w-auto h-24">
            <div className="flex justify-center items-center w-auto h-auto border-white border-2 p-2 hover:p-0 transition-all duration-300">
                <button className="py-4 px-8 text-xl bg-white text-black" onClick={onClick}>
                    Create contract
                </button>
            </div>
        </div>
    );
}
function SolCheckBox({ checked, onChange, text }: { checked: boolean, onChange: (event: React.ChangeEvent<HTMLInputElement>) => any; text: string; }) {
    return (
        <div className="flex flex-row justify-start items-center gap-4">
            <p>{text}</p>
            <input
                className={`appearance-none outline-none w-4 h-4 rounded-sm hover:cursor-pointer border-white ${checked ? "bg-gradient-to-tr from-fuchsia-400 via-purple-600 to-teal-500" : "border-2 bg-transparent"}`}
                checked={checked}
                onChange={onChange}
                type="checkbox"
            />
        </div>
    );

}
function TrackedTypeBar({ func, selectedType }: { func: (type: string) => any; selectedType: string; }) {
    return (
        <div className="flex flex-row justify-start items-center gap-4">
            {availableTypes.map((type: string, i: number) => {
                if (type === selectedType) {
                    return (
                        <div key={i} className="rounded-full border-white border py-2 px-4 text-black hover:cursor-pointer bg-white text-center w-auto h-auto" onClick={() => func(type)}>
                            {type}
                        </div>
                    );
                } else {
                    return (
                        <div key={i} className="rounded-full border-white border py-2 px-4 hover:text-black hover:cursor-pointer hover:bg-white bg-transparent text-center w-auto h-auto" onClick={() => func(type)}>
                            {type}
                        </div>
                    );
                }

            })
            }
        </div>
    );
}
type StyledInputProps = {
    value: string;
    placeholder: string;
    isError: boolean;
    deactivated?: boolean;
    label: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
};
function StyledInput({ value, placeholder, isError, deactivated, label, onChange }: StyledInputProps) {
    return (
        <div className="flex flex-col justify-center items-center w-auto h-auto gap-2">
            <div className="flex flex-row justify-start items-center w-full px-4">
                <p className="text-xl">{label}</p>
            </div>
            <div className={`w-auto h-auto py-2 px-4 border ${isError ? "border-red-600" : "border-white"} rounded-full ${deactivated ? "opacity-50" : ""}`}>
                <input
                    className="w-[300px] outline-none appearance-none bg-transparent"
                    value={value}
                    type="text"
                    placeholder={placeholder}
                    disabled={deactivated}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}
function Panel({ children }: { children: React.ReactNode; }) {
    return (
        <div className="relative w-full h-full flex flex-col justify-center items-center rounded-xl border-slate-800 border-2 group p-8">
            {children}
            <div className="absolute top-0 left-0 w-[1px] h-[50%] group-hover:top-24 transition-all duration-500  bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
    );
};

function Spinner() {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-white"></div>
        </div>
    );
};