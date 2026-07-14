
export interface fileNode {
    name: string;
    path: string;
    type: "file" | "directory";
    isOpen?: boolean,
    children?: fileNode[]
}
export function FileItems({ file, onFolderClick, setSelectedFile }: {
    file: fileNode,
    onFolderClick: (file: fileNode) => void
    setSelectedFile: React.Dispatch<React.SetStateAction<fileNode | null>>
}) {
    const handleClick = () => {
        if (file.type === "file") {
            setSelectedFile(file);
        } else if (file.type === "directory") {
            onFolderClick(file);
        }
    }
    return (
        <div>
            <div
                onClick={handleClick}
                style={{ cursor: "pointer" }}
            >
                {file.type === "directory"
                    ? `📁 ${file.name}`
                    : `📄 ${file.name}`}
            </div>

            {file.type === "directory" &&
                file.isOpen &&
                file.children && (
                    <div style={{ marginLeft: "20px" }}>
                        {file.children.map((child) => (
                            <FileItems
                                key={child.path}
                                file={child}
                                onFolderClick={onFolderClick}
                                setSelectedFile={setSelectedFile}
                            />
                        ))}
                    </div>
                )}
        </div>
    )
}