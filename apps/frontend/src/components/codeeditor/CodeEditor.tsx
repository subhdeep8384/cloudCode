import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  handlekeydown: (e: globalThis.KeyboardEvent) => void;
};

export function CodeEditor({
  value,
  onChange,
  handlekeydown,
}: Props) {
  const handleKeyDownRef = useRef(handlekeydown);

  useEffect(() => {
    handleKeyDownRef.current = handlekeydown;
  }, [handlekeydown]);

  return (
    <>
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language="typescript"
          value={value}
          onChange={(value) => {
            console.log("the value is", value);
            onChange(value ?? "");
          }}
          options={{
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
            mouseWheelZoom : true ,
            fontSize: 20,
            wordWrap: "on",
            scrollBeyondLastLine: false,
          }}
          onMount={(editor) => {
            editor.onKeyDown((e) => {
              handleKeyDownRef.current(e.browserEvent);
            });
          }}
        />
    
    </>
  );
}