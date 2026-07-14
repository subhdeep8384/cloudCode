type Props = {
    value: string;
    onChange: (value: string) => void;
};

export function CodeEditor({value , onChange} : Props) {
    return (
        <>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full outline-none resize-none"
            />
        </>
    )
}