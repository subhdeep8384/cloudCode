import { useEffect, useState } from "react"
import FileExplorer from "../components/sidebar/FileExplorer"
import type { fileNode } from "../components/sidebar/FileItems"
import { CodeEditor } from "../components/codeeditor/CodeEditor"
import { getdata } from "../api/files/getFiles"
import { saveFile } from "../api/files/saveFile"
import { useParams } from "react-router-dom"

function PlayGround() {
  const [selectedFile, setSelectedFile] = useState<fileNode | null>(null)
  const [content, setContent] = useState("")
  const { workspaceId } = useParams();

  const handlekeydown = async (e: globalThis.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      console.log("content", content)
      const data = await saveFile(content as string, workspaceId!, selectedFile!.path as string);
      console.log(data)
    }
  }

  useEffect(() => {
    const loadFile = async () => {
      if (!selectedFile) return;

      const data = await getdata(
        workspaceId!,
        selectedFile.path
      );

      setContent(data.content);
    };

    loadFile();
  }, [selectedFile, workspaceId]);

  const [openFileExplorer , setOpenFileExplorer] = useState<boolean>(true) ;

  return (
    <div className="flex h-screen ">
      {openFileExplorer && 
      <div className="w-1/5 border-r">
         <FileExplorer
          workspaceId={workspaceId!}
          setSelectedFile={setSelectedFile}
        />
      </div>
      }

      <div className={`${openFileExplorer ?? "w-4/5 border-r"} : w-full  `}>
        {selectedFile && <CodeEditor
          handlekeydown={handlekeydown}
          value={content}
          onChange={setContent}
        />}
        <>please selected some file ...</>
      </div>
    </div>
  )
}

export default PlayGround
