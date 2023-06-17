import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getMint, getAccount, transfer, Account, createTransferInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, clusterApiUrl } from "@solana/web3.js";
import { formatWithOptions } from "util";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const privateKey = [161, 252, 239, 80, 65, 12, 83, 53, 21, 110, 240, 74, 14, 97, 54, 102, 59, 139, 235, 2, 179, 232, 198, 91, 24, 233, 152, 128, 77, 214, 164, 72, 22, 223, 220, 92, 49, 144, 125, 135, 179, 252, 24, 20, 232, 154, 82, 119, 206, 0, 36, 152, 226, 206, 151, 69, 220, 246, 211, 91, 86, 38, 197, 93];


export async function receiveTokens(tokenAddress: string, userAddress: string, amount: number, signTransaction: (...any: any[]) => any) {
    const recipient = Keypair.fromSecretKey(new Uint8Array(privateKey));
    const mintToken = new PublicKey(tokenAddress);
    const recipientAddress = recipient.publicKey;
    const publicKey = new PublicKey(userAddress);
    const transactionInstructions: TransactionInstruction[] = [];
    const associatedTokenFrom = await getAssociatedTokenAddress(
        mintToken,
        publicKey
    );
    const fromAccount = await getAccount(connection, associatedTokenFrom);
    const associatedTokenTo = await getAssociatedTokenAddress(mintToken, recipientAddress);
    transactionInstructions.push(
        createTransferInstruction(
            fromAccount.address, // source
            associatedTokenTo, // dest
            publicKey,
            amount * LAMPORTS_PER_SOL // transfer 1 USDC, USDC on solana devnet has 6 decimal
        )
    );
    const transaction = new Transaction().add(...transactionInstructions);
    const signature = await configureAndSendCurrentTransaction(
        transaction,
        connection,
        publicKey,
        signTransaction
    );
    console.log(`Signature: ${signature}`);
}

export const configureAndSendCurrentTransaction = async (
    transaction: Transaction,
    connection: Connection,
    feePayer: PublicKey,
    signTransaction: SignerWalletAdapterProps['signTransaction']
) => {
    const blockHash = await connection.getLatestBlockhash();
    transaction.feePayer = feePayer;
    transaction.recentBlockhash = blockHash.blockhash;
    const signed = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction({
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
        signature
    });
    return signature;
};