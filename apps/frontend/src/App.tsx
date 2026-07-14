import { useEffect, useState, type KeyboardEvent } from "react"
import FileExplorer from "./components/sidebar/FileExplorer"
import type { fileNode } from "./components/sidebar/FileItems"
import { CodeEditor } from "./components/codeeditor/CodeEditor"
import { getdata  } from "./api/files/getFiles"
import { saveFile } from "./api/files/saveFile"

function App() {
  const [selectedFile, setSelectedFile] = useState<fileNode | null>(null)
  const [content, setContent] = useState("")
  const workspaceId = "3c290fe1-d42d-412b-bd7c-6b32da1f9ddb";

    const handlekeydown = (e: KeyboardEvent<HTMLTextAreaElement>) =>{
          if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
              e.preventDefault(); 
              console.log("content")
              const data = saveFile(content as string , workspaceId , selectedFile!.path  as string);
              console.log(data)
          }
    }

  useEffect(() => {
      const loadFile = async () => {
          if (!selectedFile) return;
          
          const data = await getdata(
              workspaceId,
              selectedFile.path
          );

          setContent(data.content);
    };

    loadFile();
}, [selectedFile, workspaceId]);


  return (
    <div className="flex h-screen ">
      <div className="w-1/5 border-r">
        <FileExplorer
          workspaceId={workspaceId}
          setSelectedFile={setSelectedFile}
        />
      </div>

      <div className="w-2/5 border-r">
        <CodeEditor
        handlekeydown={handlekeydown}
          value={content}
          onChange={setContent}
        />
      </div>

      <div className="flex-1">
        Preview
      </div>
    </div>
  )
}

export default App
