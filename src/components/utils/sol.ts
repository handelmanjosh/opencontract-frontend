
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, getMint, getAccount, transfer, Account, createTransferInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
const privateKey = [161, 252, 239, 80, 65, 12, 83, 53, 21, 110, 240, 74, 14, 97, 54, 102, 59, 139, 235, 2, 179, 232, 198, 91, 24, 233, 152, 128, 77, 214, 164, 72, 22, 223, 220, 92, 49, 144, 125, 135, 179, 252, 24, 20, 232, 154, 82, 119, 206, 0, 36, 152, 226, 206, 151, 69, 220, 246, 211, 91, 86, 38, 197, 93];
export const generateKey = () => console.log(String(Keypair.generate().secretKey));
export const getMyBase58Pubkey = () => console.log(Keypair.fromSecretKey(new Uint8Array(privateKey)).publicKey.toBase58());
export async function sendSol(amount: number, to: string) {
    console.log(amount, to);
    const from = Keypair.fromSecretKey(new Uint8Array(privateKey));
    const publicKey = new PublicKey(to);
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: publicKey,
            lamports: amount * LAMPORTS_PER_SOL,
        }),
    );

    // Sign transaction, broadcast, and confirm
    const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
    );
    console.log(`Transaction signature: ${signature}`);
}
export async function receiveSol(userAddress: string, amount: number, signTransaction: (...any: any[]) => any) {
    const recipient = Keypair.fromSecretKey(new Uint8Array(privateKey));
    const publicKey = new PublicKey(userAddress);
    const transactionInstructions: TransactionInstruction[] = [];
    transactionInstructions.push(
        SystemProgram.transfer(
            {
                fromPubkey: publicKey,
                toPubkey: recipient.publicKey,
                lamports: amount * LAMPORTS_PER_SOL,
            }
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