import React, { useState, useEffect } from 'react';
import EditorNavbar from '../components/EditorNavbar';
import Editors from '@monaco-editor/react';
import { MdLightMode } from "react-icons/md";
import { AiOutlineExpandAlt } from "react-icons/ai";
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';

const Editor = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState("<h1>Hello world</h1>");
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");

  const { projectID } = useParams();

  // Toggle theme
  const changeTheme = () => {
    if (isLightMode) {
      document.querySelector(".EditorNavbar").style.background = "#141414";
      document.body.classList.remove("lightMode");
      setIsLightMode(false);
    } else {
      document.querySelector(".EditorNavbar").style.background = "#f4f4f4";
      document.body.classList.add("lightMode");
      setIsLightMode(true);
    }
  };

  // Listen for iframe console messages
  useEffect(() => {
    const handler = (event) => {
      if (event.data.type === "iframe-log") {
        console.log(...event.data.args);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Load project data
  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID
      })
    })
      .then(async res => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.success && data.project) {
          setHtmlCode(data.project.htmlCode || "<h1>Hello world</h1>");
          setCssCode(data.project.cssCode || "body { background-color: #f4f4f4; }");
          setJsCode(data.project.jsCode || "// some comment");
        } else {
          console.error("❌ Failed:", data.message);
        }
      })
      .catch(err => console.error("Fetch error:", err));
  }, [projectID]);

  // Update iframe content (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const jsWrapped = `
        (function() {
          const oldLog = console.log;
          console.log = function(...args) {
            window.parent.postMessage({ type: 'iframe-log', args }, '*');
            oldLog.apply(console, args);
          };
        })();
        ${jsCode}
      `;

      const srcDoc = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <style>${cssCode}</style>
          </head>
          <body>
            ${htmlCode}
            <script>${jsWrapped}<\/script>
          </body>
        </html>
      `;

      const iframe = document.getElementById("iframe");
      if (iframe) iframe.srcdoc = srcDoc;
    }, 300); // debounce

    return () => clearTimeout(timeout);
  }, [htmlCode, cssCode, jsCode]);


    useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the default save file dialog
  
        // Ensure that projectID and code states are updated and passed to the fetch request
        fetch(api_base_url + "/updateProject", {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: localStorage.getItem("userId"),
            projId: projectID,  // Make sure projectID is correct
            htmlCode: htmlCode,  // Passing the current HTML code
            cssCode: cssCode,    // Passing the current CSS code
            jsCode: jsCode       // Passing the current JS code
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Project saved successfully");
          } else {
            alert("Something went wrong");
          }
        })
        .catch((err) => {
          console.error("Error saving project:", err);
          alert("Failed to save project. Please try again.");
        });
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
  
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectID, htmlCode, cssCode, jsCode]);

  return (
    <>
      <EditorNavbar />

      <div className="flex">
        <div className={`left ${isExpanded ? "w-full" : "w-1/2"}`}>
          <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]">
            <div className="tabs flex items-center gap-2">
              <div onClick={() => setTab("html")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">HTML</div>
              <div onClick={() => setTab("css")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">CSS</div>
              <div onClick={() => setTab("js")} className="tab cursor-pointer p-[6px] bg-[#1E1E1E] px-[10px] text-[15px]">JavaScript</div>
            </div>
            <div className="flex items-center gap-2">
              <i className="text-[20px] cursor-pointer" onClick={changeTheme}><MdLightMode /> </i>
              <i className="text-[20px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}><AiOutlineExpandAlt /></i>
            </div>
          </div>

          {tab === "html" ? (
            <Editors
              onChange={(value) => setHtmlCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="html"
              value={htmlCode}
              options={{
                fontSize: 14,
                automaticLayout: true,
                wordWrap: "on",
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                suggestOnTriggerCharacters: true,
                tabSize: 2,
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          ) : tab === "css" ? (
            <Editors
              onChange={(value) => setCssCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="css"
              value={cssCode}
              options={{
                fontSize: 14,
                automaticLayout: true,
                wordWrap: "on",
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                suggestOnTriggerCharacters: true,
                tabSize: 2,
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          ) : (
            <Editors
              onChange={(value) => setJsCode(value || "")}
              height="82vh"
              theme={isLightMode ? "vs-light" : "vs-dark"}
              language="javascript"
              value={jsCode}
              options={{
                fontSize: 14,
                automaticLayout: true,
                wordWrap: "on",
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                suggestOnTriggerCharacters: true,
                tabSize: 2,
                formatOnType: true,
                formatOnPaste: true,
              }}
            />
          )}
        </div>

        {!isExpanded && (
          <iframe id="iframe" className="w-[50%] min-h-[82vh] bg-[#fff] text-black" title="output" />
        )}
      </div>
    </>
  );
};

export default Editor;
