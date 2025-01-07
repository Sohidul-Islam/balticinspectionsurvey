import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const SectionList = styled.div`
  margin-top: 2rem;
`;

const SectionCard = styled(motion.div)`
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: move;
`;

const AddSectionButton = styled(motion.button)`
  padding: 1rem;
  width: 100%;
  background: #f1f2f6;
  border: 2px dashed #ddd;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 1rem;

  &:hover {
    border-color: #2d3436;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
`;

interface Section {
  type: "hero" | "text" | "imageGrid" | "list";
  data: any;
}

const SectionManager = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedType, setSelectedType] = useState<Section["type"] | null>(
    null
  );

  const handleAddSection = (type: Section["type"]) => {
    const newSection: Section = {
      type,
      data: getInitialData(type),
    };
    setSections([...sections, newSection]);
    setSelectedType(null);
  };

  const getInitialData = (type: Section["type"]) => {
    switch (type) {
      case "hero":
        return {
          image: "",
          heading: "",
          subheading: "",
        };
      case "text":
        return {
          heading: "",
          content: "",
        };
      case "imageGrid":
        return {
          images: [],
          caption: "",
        };
      case "list":
        return {
          heading: "",
          items: [""],
        };
      default:
        return {};
    }
  };

  const handleUpdateSection = (index: number, data: any) => {
    const newSections = [...sections];
    newSections[index].data = data;
    setSections(newSections);
  };

  const renderSectionEditor = (section: Section, index: number) => {
    switch (section.type) {
      case "hero":
        return (
          <div>
            <FormGroup>
              <Label>Hero Image URL</Label>
              <Input
                type="text"
                value={section.data.image}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    image: e.target.value,
                  })
                }
              />
              {section.data.image && (
                <ImagePreview src={section.data.image} alt="Hero preview" />
              )}
            </FormGroup>
            <FormGroup>
              <Label>Heading</Label>
              <Input
                type="text"
                value={section.data.heading}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    heading: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Subheading</Label>
              <Input
                type="text"
                value={section.data.subheading}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    subheading: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
        );

      case "text":
        return (
          <div>
            <FormGroup>
              <Label>Heading</Label>
              <Input
                type="text"
                value={section.data.heading}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    heading: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <TextArea
                value={section.data.content}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    content: e.target.value,
                  })
                }
              />
            </FormGroup>
          </div>
        );

      case "imageGrid":
        return (
          <div>
            <FormGroup>
              <Label>Caption</Label>
              <Input
                type="text"
                value={section.data.caption}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    caption: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Images (one URL per line)</Label>
              <TextArea
                value={section.data.images.join("\n")}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    images: e.target.value.split("\n").filter(Boolean),
                  })
                }
              />
            </FormGroup>
          </div>
        );

      case "list":
        return (
          <div>
            <FormGroup>
              <Label>Heading</Label>
              <Input
                type="text"
                value={section.data.heading}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    heading: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup>
              <Label>Items (one per line)</Label>
              <TextArea
                value={section.data.items.join("\n")}
                onChange={(e) =>
                  handleUpdateSection(index, {
                    ...section.data,
                    items: e.target.value.split("\n").filter(Boolean),
                  })
                }
              />
            </FormGroup>
          </div>
        );
    }
  };

  return (
    <Container>
      <h2>Section Manager</h2>

      <DragDropContext
        onDragEnd={(result) => {
          if (!result.destination) return;
          const items = Array.from(sections);
          const [reorderedItem] = items.splice(result.source.index, 1);
          items.splice(result.destination.index, 0, reorderedItem);
          setSections(items);
        }}
      >
        <Droppable droppableId="sections">
          {(provided) => (
            <SectionList ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => (
                <Draggable
                  key={index}
                  draggableId={`section-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <SectionCard
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onDragStart={(event) => {
                        if (
                          provided.dragHandleProps?.onDragStart &&
                          typeof provided.dragHandleProps.onDragStart ===
                            "function"
                        ) {
                          provided.dragHandleProps.onDragStart(event as any);
                        }
                      }}
                    >
                      <h3>{section.type}</h3>
                      {renderSectionEditor(section, index)}
                    </SectionCard>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </SectionList>
          )}
        </Droppable>
      </DragDropContext>

      {!selectedType ? (
        <div>
          <AddSectionButton
            onClick={() => setSelectedType("hero")}
            whileHover={{ scale: 1.02 }}
          >
            Add Hero Section
          </AddSectionButton>
          <AddSectionButton
            onClick={() => setSelectedType("text")}
            whileHover={{ scale: 1.02 }}
          >
            Add Text Section
          </AddSectionButton>
          <AddSectionButton
            onClick={() => setSelectedType("imageGrid")}
            whileHover={{ scale: 1.02 }}
          >
            Add Image Grid
          </AddSectionButton>
          <AddSectionButton
            onClick={() => setSelectedType("list")}
            whileHover={{ scale: 1.02 }}
          >
            Add List Section
          </AddSectionButton>
        </div>
      ) : (
        <AddSectionButton
          onClick={() => handleAddSection(selectedType)}
          whileHover={{ scale: 1.02 }}
        >
          Confirm Add {selectedType} Section
        </AddSectionButton>
      )}
    </Container>
  );
};

export default SectionManager;
