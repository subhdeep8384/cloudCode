import type { KeyboardEvent } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    handlekeydown : (e: KeyboardEvent<HTMLTextAreaElement>) => void 
};

export function CodeEditor({value , onChange , handlekeydown} : Props) {
   
    return (
        <>
            <textarea
            onKeyDown={handlekeydown}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full outline-none resize-none"
            />
        </>
    )
}