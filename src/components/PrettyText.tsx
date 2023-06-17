

export default function PrettyText({ text }: { text: string; }) {
    return (
        <p className="text-center font-bold text-transparent bg-clip-text p-1 bg-gradient-to-tr from-[#9945FF] to-[#14F195]">
            {text}
        </p>
    );
}