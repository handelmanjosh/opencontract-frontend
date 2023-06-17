import PrettyText from "./PrettyText";


export default function TextText({ title, text }: { title: string, text: string; }) {
    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full bg-slate-800 p-4 rounded-lg">
            <div className="text-2xl w-full flex flex-row justify-start items-center">
                <PrettyText text={title} />
            </div>
            <p className="text-left w-full text-lg">
                {text}
            </p>
        </div>
    );
}