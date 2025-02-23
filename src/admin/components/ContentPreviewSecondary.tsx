import styled from "styled-components";
import { motion } from "framer-motion";
import { Section } from "../../services/contentApi";
import { FiEye } from "react-icons/fi";
import { sectionComponents } from "../../components/DynamicPage";

const PreviewContainer = styled.div`
  margin-top: 2rem;
  max-width: min(500px, 80vw);
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const PreviewTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3436;
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const SectionPreview = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: grab;
  position: relative;
  user-select: none;
  touch-action: none;

  &:active {
    cursor: grabbing;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export const SectionType = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const ActionButton = styled(motion.button)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #f8faff;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: #e0e7ff;
    color: #3b82f6;
  }
`;

interface ContentPreviewProps {
  sections: Section[];
  onEdit?: (index: number) => void;
  onPreview?: () => void;
}

const ContentPreviewSecondary: React.FC<ContentPreviewProps> = ({
  sections,
  onPreview,
}) => {
  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>Content Preview</PreviewTitle>
        <ActionButton onClick={onPreview} whileHover={{ scale: 1.1 }}>
          <FiEye />
        </ActionButton>
      </PreviewHeader>

      <div
        // axis="y"
        // values={sections}
        // onReorder={(value) => onReorder?.(value)}
        style={{ padding: "0.5rem 0" }}
      >
        {sections.map((section, index) => (
          <SectionPreview key={section.type + index}>
            <SectionType>{section.type}</SectionType>
            {/* <ActionButtons>
              <ActionButton
                onClick={() => onEdit?.(index)}
                whileHover={{ scale: 1.1 }}
              >
                <FiEdit2 />
              </ActionButton>
              <DragHandle>
                <FiMove size={20} />
              </DragHandle>
            </ActionButtons> */}

            <div
              style={{
                transform: "translate3d(0,0, 0)", // Very small 3D translation
                transition: "transform 0.3s ease", // Optional, for smooth transition
                maxWidth: "100%",
              }}
            >
              {(() => {
                const SectionComponent =
                  sectionComponents[
                    section?.type as keyof typeof sectionComponents
                  ];
                return (
                  <SectionComponent
                    data={section.data as any}
                    variant="secondary"
                  />
                );
              })()}
            </div>
          </SectionPreview>
        ))}
      </div>
    </PreviewContainer>
  );
};

export default ContentPreviewSecondary;
