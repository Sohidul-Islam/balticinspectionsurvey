import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { pageService } from "../../services/api";

const Container = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ComponentPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const ComponentItem = styled(motion.div)`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  border: 2px dashed #ddd;

  &:hover {
    border-color: #2d3436;
  }
`;

const Canvas = styled.div`
  min-height: 600px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const PageComponent = styled(motion.div)`
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: move;
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

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: #2d3436;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 1rem;

  &.preview {
    background: #00b894;
  }

  &.publish {
    background: #0984e3;
  }
`;

interface PageData {
  title: string;
  route: string;
  components: PageComponentData[];
}

interface PageComponentData {
  id: string;
  type: "heading" | "text" | "image" | "list" | "imageGroup";
  content: any;
}

const componentTypes = [
  { type: "heading", label: "Heading" },
  { type: "text", label: "Text Block" },
  { type: "image", label: "Single Image" },
  { type: "list", label: "List" },
  { type: "imageGroup", label: "Image Group" },
];

const PageBuilder = () => {
  const [pageData, setPageData] = useState<PageData>({
    title: "",
    route: "",
    components: [],
  });
  const [selectedComponent, setSelectedComponent] =
    useState<PageComponentData | null>(null);

  console.log({ selectedComponent });

  const handleAddComponent = (type: string) => {
    const newComponent: PageComponentData = {
      id: `component-${Date.now()}`,
      type: type as PageComponentData["type"],
      content: {},
    };
    setPageData({
      ...pageData,
      components: [...pageData.components, newComponent],
    });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(pageData.components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPageData({
      ...pageData,
      components: items,
    });
  };

  const handleSave = async () => {
    try {
      await pageService.createPage(pageData);
      alert("Page saved successfully!");
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Error saving page");
    }
  };

  const handlePreview = () => {
    // Implement preview logic
  };

  return (
    <Container>
      <PageHeader>
        <h2>Page Builder</h2>
        <div>
          <Button
            className="preview"
            onClick={handlePreview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Preview
          </Button>
          <Button
            className="publish"
            onClick={handleSave}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Publish
          </Button>
        </div>
      </PageHeader>

      <FormGroup>
        <Label>Page Title</Label>
        <Input
          type="text"
          value={pageData.title}
          onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
          placeholder="Enter page title"
        />
      </FormGroup>

      <FormGroup>
        <Label>Page Route</Label>
        <Input
          type="text"
          value={pageData.route}
          onChange={(e) => setPageData({ ...pageData, route: e.target.value })}
          placeholder="Enter page route (e.g., /about-us)"
        />
      </FormGroup>

      <ComponentPalette>
        {componentTypes.map((component) => (
          <ComponentItem
            key={component.type}
            onClick={() => handleAddComponent(component.type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {component.label}
          </ComponentItem>
        ))}
      </ComponentPalette>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="page-components">
          {(provided) => (
            <Canvas ref={provided.innerRef} {...provided.droppableProps}>
              {pageData.components.map((component, index) => (
                <Draggable
                  key={component.id}
                  draggableId={component.id}
                  index={index}
                >
                  {(provided) => (
                    <PageComponent
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => setSelectedComponent(component)}
                      onDragStart={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    >
                      <h4>{component.type}</h4>
                      {/* Component editor will go here */}
                    </PageComponent>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Canvas>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default PageBuilder;
