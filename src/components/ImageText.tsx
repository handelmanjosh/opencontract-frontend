import PrettyText from "./PrettyText";

export default function ImageText({ src, text, title }: { src: string, text: string, title: string; }) {
    return (
        <div className="w-[33%] flex flex-col justify-center items-center gap-4">
            <div className="w-[90%] aspect-square overflow-hidden rounded-lg">
                <img src={src} className="object-cover w-full h-full" />
            </div>

            <div className="text-2xl">
                <PrettyText text={title} />
            </div>
            <p className="text-center w-full text-lg">
                {text}
            </p>
        </div>
    );
}