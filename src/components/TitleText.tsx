import PrettyText from "./PrettyText";


export default function TitleText({ title, text }: { title: string, text: string; }) {
    return (
        <div className="w-[33%] flex flex-col justify-center items-center gap-4">
            <div className="text-2xl">
                <PrettyText text={title} />
            </div>
            <p className="text-center w-full text-lg">
                {text}
            </p>
        </div>
    );
}