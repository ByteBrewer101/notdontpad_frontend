import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { FaCopy, FaCheck, FaShare, FaArrowLeft } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SharePage() {
  const [code, setCode] = useState("");
  const [receivedData, setReceivedData] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    setIsLoading(false);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      getData();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (code) {
      handleSave();
    }
  }, [code]);

  async function handleSave() {
    try {
      await axios.post(`http://100.20.92.101/senddata/${id}`, {
        data: code,
      });
    } catch (err) {
      toast.error("Error saving data");
      console.error("Error saving data:", err);
    }
  }

  async function getData() {
    try {
      const resp = await axios.get(`http://100.20.92.101/getdata/${id}`);
      const currData = resp.data.text;
      if (currData !== receivedData) {
        setReceivedData(currData);
        if (editorRef.current && currData !== editorRef.current.getValue()) {
          editorRef.current.setValue(currData);
        }
      }
    } catch (err) {
      toast.error("Error fetching updates");
      console.error("Error getting data:", err);
    }
  }

  function handleEditorChange(value) {
    setCode(value || "");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this code',
        text: 'I shared some code with you',
        url: window.location.href,
      }).catch(err => {
        toast.error("Error sharing: " + err);
      });
    } else {
      handleCopy();
    }
  }

  return (
    <div className="d-flex flex-column vh-100 bg-dark text-white">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <header className="d-flex justify-content-between align-items-center p-3 bg-dark border-bottom border-secondary">
        <button 
          onClick={() => navigate('/')} 
          className="btn btn-outline-light"
        >
          <FaArrowLeft className="me-2" />
          Back
        </button>
        
        <div className="d-flex align-items-center">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="form-select form-select-sm bg-dark text-light me-2"
            style={{ width: '120px' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="typescript">TypeScript</option>
          </select>
          
          <button 
            onClick={handleCopy}
            className="btn btn-outline-light me-2"
            disabled={isCopied}
          >
            {isCopied ? <FaCheck /> : <FaCopy />}
            <span className="ms-2 d-none d-sm-inline">Copy Link</span>
          </button>
          
          <button 
            onClick={handleShare}
            className="btn btn-primary"
          >
            <FaShare className="me-2" />
            Share
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex-grow-1 position-relative">
        {isLoading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75 z-1">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <Editor
          height="100%"
          language={language}
          defaultValue="// Start typing your code here..."
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
          onMount={handleEditorDidMount}
        />
      </div>

      {/* Status Bar */}
      <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-dark border-top border-secondary small">
        <div>
          <span className="badge bg-secondary me-2">Session ID: {id}</span>
          <span className="text-muted">Real-time updates active</span>
        </div>
        <div className="text-muted">
          Changes saved automatically
        </div>
      </div>
    </div>
  );
}