import styled from "styled-components";
import { motion, Reorder } from "framer-motion";
import { Section } from "../../services/contentApi";
import { FiEdit2, FiEye, FiMove } from "react-icons/fi";
import { BASE_URL } from "../../services/api";

const PreviewContainer = styled.div`
  margin-top: 2rem;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PreviewTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3436;
`;

const SectionPreview = styled(Reorder.Item)`
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
`;

const SectionType = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
`;

const PreviewContent = styled.div`
  margin-top: 1rem;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
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

  &:hover {
    background: #e0e7ff;
    color: #3b82f6;
  }
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 1rem;
`;

const GridPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
`;

const ListPreview = styled.ul`
  margin: 1rem 0;
  padding-left: 1.5rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

const DragHandle = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: grab;

  &:active {
    cursor: grabbing;
    color: #3b82f6;
  }
`;

interface ContentPreviewProps {
  sections: Section[];
  onReorder: (newOrder: Section[]) => void;
  onEdit: (index: number) => void;
  onPreview: () => void;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  sections,
  onReorder,
  onEdit,
  onPreview,
}) => {
  const getImageUrl = (path: string) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${BASE_URL}${path}`;
  };

  const renderSectionPreview = (section: Section) => {
    switch (section.type) {
      case "heroSlider":
        return (
          <>
            {section.data.heroImages.map((heroImage: any, index: number) => (
              <div key={index}>
                <ImagePreview src={getImageUrl(heroImage.image)} alt="Hero" />
                <h4>{heroImage.heading}</h4>
                <p>{heroImage.subheading}</p>
              </div>
            ))}
          </>
        );
      case "hero":
        return (
          <>
            <div>
              <ImagePreview src={getImageUrl(section.data.image)} alt="Hero" />
              <h4>{section.data.heading}</h4>
              <p>{section.data.subheading}</p>
            </div>
          </>
        );

      case "imageGrid":
        return (
          <>
            <h3>{section.data.title}</h3>
            <p>{section.data.description}</p>
            <GridPreview>
              {[1, 2, 3].map(
                (num) =>
                  section.data[`image${num}`] && (
                    <ImagePreview
                      key={num}
                      src={getImageUrl(section.data[`image${num}`])}
                      alt={`Grid image ${num}`}
                    />
                  )
              )}
            </GridPreview>
          </>
        );

      case "list":
        return (
          <>
            <h3>{section.data.title}</h3>
            <ListPreview>
              {section.data.items?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ListPreview>
          </>
        );

      case "text":
        return (
          <>
            <h3>{section.data.title}</h3>
            <PreviewContent>{section.data.content}</PreviewContent>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>Content Preview</PreviewTitle>
        <ActionButton onClick={onPreview} whileHover={{ scale: 1.1 }}>
          <FiEye />
        </ActionButton>
      </PreviewHeader>

      <Reorder.Group
        axis="y"
        values={sections}
        onReorder={onReorder}
        style={{ padding: "0.5rem 0" }}
      >
        {sections.map((section, index) => (
          <SectionPreview
            key={section.type + index}
            value={section}
            initial={false}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.2 },
            }}
            whileDrag={{
              scale: 1.02,
              backgroundColor: "#f8faff",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.12)",
            }}
            transition={{
              duration: 0.2,
            }}
          >
            <SectionType>{section.type}</SectionType>
            <ActionButtons>
              <ActionButton
                onClick={() => onEdit(index)}
                whileHover={{ scale: 1.1 }}
              >
                <FiEdit2 />
              </ActionButton>
              <DragHandle>
                <FiMove size={20} />
              </DragHandle>
            </ActionButtons>
            {renderSectionPreview(section)}
          </SectionPreview>
        ))}
      </Reorder.Group>
    </PreviewContainer>
  );
};

export default ContentPreview;
