import { useEffect, useState } from "react"
import { getFiles } from "../../api/files/getFiles";
import { FileItems } from "./FileItems";


export interface fileNode {
    name: string;
    path: string;
    type: "file" | "directory";
    isOpen?: boolean,
    children?: fileNode[]
}
interface props {
    workspaceId: string
    setSelectedFile: React.Dispatch<React.SetStateAction<fileNode | null>>
}
function FileExplorer({ workspaceId, setSelectedFile }: props) {
    const [files, setFiles] = useState<fileNode[]>([]);
    const [folderOpen , setFolderOpen ] = useState<boolean>(false)
    const updateTree = (
        nodes: fileNode[],
        targetPath: string,
        newChildren: fileNode[]
    ): fileNode[] => {
        return nodes.map((node) => {
            if (node.path === targetPath) {
                return {
                    ...node,
                    isOpen: !folderOpen,
                    children: newChildren,
                };
            }
            if (node.children) {
                return {
                    ...node,
                    children: updateTree(
                        node.children,
                        targetPath,
                        newChildren
                    ),
                };
            }

            return node;
        });
    };

    const handleFolderClick = async (file: fileNode) => {
        setFolderOpen(t => !t) ;
        const data = await getFiles(workspaceId, file.path);
        const updatedTree = updateTree(files, file.path, data)
        console.log("Updated Tree:", JSON.stringify(updatedTree, null, 2));
        setFiles(updatedTree)
    };

    const loadFiles = async () => {
        const data = await getFiles("3c290fe1-d42d-412b-bd7c-6b32da1f9ddb" as string, "");
        setFiles(data);
    };


    useEffect(() => {
        loadFiles();
    }, [])
    return (
        <div>
            {
                files.map(file => (
                    <FileItems
                        file={file}
                        setSelectedFile={setSelectedFile}
                        onFolderClick={handleFolderClick}
                    />
                ))
            }
        </div>
    )
}
export default FileExplorer