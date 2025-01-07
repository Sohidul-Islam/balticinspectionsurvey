import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const EditorContainer = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-top: 1rem;
`;

const ImageUpload = styled.div`
  border: 2px dashed #ddd;
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
`;

interface ComponentEditorProps {
  component: any;
  onUpdate: (content: any) => void;
}

const ComponentEditor = ({ component, onUpdate }: ComponentEditorProps) => {
  const [content, setContent] = useState(component.content);

  const renderEditor = () => {
    switch (component.type) {
      case "heading":
        return (
          <input
            type="text"
            value={content.text || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleUpdate({ text: e.target.value })
            }
            placeholder="Enter heading text"
          />
        );
      case "text":
        return (
          <textarea
            value={content.text || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              handleUpdate({ text: e.target.value })
            }
            placeholder="Enter text content"
          />
        );
      // Add other component editors
    }
  };

  const handleUpdate = (newContent: any) => {
    setContent(newContent);
    onUpdate(newContent);
  };

  return <EditorContainer>{renderEditor()}</EditorContainer>;
};

export default ComponentEditor;
