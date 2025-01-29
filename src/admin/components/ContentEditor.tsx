import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Section } from "../../services/contentApi";
import ImageUploader from "./ImageUploader";
import { TfiLayoutSlider } from "react-icons/tfi";
import { FaRegImage } from "react-icons/fa";
import { PiImages, PiList, PiTextT } from "react-icons/pi";

const EditorContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #74b9ff;
  }
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #0984e3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:disabled {
    background: #b2bec3;
    cursor: not-allowed;
  }
`;

const AddSectionButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #74b9ff, #00b894);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SectionEditor = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  color: #2d3436;
`;

const ButtonGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DeleteButton = styled(Button)`
  background: #ff7675;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #74b9ff;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const BannerContainer = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
`;

const BannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h4 {
    margin: 0;
  }
`;

const HeroImageContainer = styled.div`
  border: 1px solid #e0e0e0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
`;

const sectionTypes = [
  { type: "heroSlider", label: "Slider Section", icon: <TfiLayoutSlider /> },
  { type: "hero", label: "Banner Section", icon: <FaRegImage /> },
  { type: "imageGrid", label: "Image Grid", icon: <PiImages /> },
  { type: "list", label: "List Section", icon: <PiList /> },
  { type: "text", label: "Text Section", icon: <PiTextT /> },
];

interface ContentEditorProps {
  onSave: (content: { title: string; sections: Section[] }) => void;
  initialContent?: {
    title: string;
    sections: Section[];
  };
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  onSave,
  initialContent,
}) => {
  const [title, setTitle] = useState(initialContent?.title || "");
  const [sections, setSections] = useState<Section[]>(
    initialContent?.sections || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, sections });
  };

  const addSection = (type: string) => {
    setSections([...sections, { type, data: { heroImages: [] } }]);
  };

  const handleSectionDataChange = (index: number, data: any) => {
    const newSections = [...sections];
    newSections[index].data = data;
    setSections(newSections);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const addHeroImage = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const heroImages = section.data.heroImages || [];
    handleSectionDataChange(sectionIndex, {
      ...section.data,
      heroImages: [
        ...heroImages,
        { image: "", heading: "", subheading: "", redirectPath: "" },
      ],
    });
  };

  const removeHeroImage = (sectionIndex: number, imageIndex: number) => {
    const section = sections[sectionIndex];
    const heroImages = section.data.heroImages.filter(
      (_: any, i: number) => i !== imageIndex
    );
    handleSectionDataChange(sectionIndex, {
      ...section.data,
      heroImages,
    });
  };

  const renderSectionEditor = (section: Section, index: number) => {
    switch (section.type) {
      case "heroSlider":
        return (
          <SectionEditor key={index}>
            <SectionHeader>
              <SectionTitle>Slider Section</SectionTitle>
              <DeleteButton onClick={() => removeSection(index)}>
                Delete
              </DeleteButton>
            </SectionHeader>

            {(section.data.heroImages || []).map(
              (heroImage: any, imageIndex: number) => (
                <HeroImageContainer key={imageIndex}>
                  <SectionHeader>
                    <h4>Hero Image {imageIndex + 1}</h4>
                    <DeleteButton
                      onClick={() => removeHeroImage(index, imageIndex)}
                    >
                      Remove Image
                    </DeleteButton>
                  </SectionHeader>

                  <FormGroup>
                    <Label>Background Image</Label>
                    <ImageUploader
                      onImageUpload={(imagePath) => {
                        const newHeroImages = [...section.data.heroImages];
                        newHeroImages[imageIndex] = {
                          ...newHeroImages[imageIndex],
                          image: imagePath,
                        };
                        handleSectionDataChange(index, {
                          ...section.data,
                          heroImages: newHeroImages,
                        });
                      }}
                      currentImage={heroImage.image}
                      onRemove={() => {
                        const newHeroImages = [...section.data.heroImages];
                        newHeroImages[imageIndex] = {
                          ...newHeroImages[imageIndex],
                          image: undefined,
                        };
                        handleSectionDataChange(index, {
                          ...section.data,
                          heroImages: newHeroImages,
                        });
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Heading</Label>
                    <Input
                      type="text"
                      value={heroImage.heading || ""}
                      onChange={(e) => {
                        const newHeroImages = [...section.data.heroImages];
                        newHeroImages[imageIndex] = {
                          ...newHeroImages[imageIndex],
                          heading: e.target.value,
                        };
                        handleSectionDataChange(index, {
                          ...section.data,
                          heroImages: newHeroImages,
                        });
                      }}
                      placeholder="Enter heading"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Subheading</Label>
                    <Input
                      type="text"
                      value={heroImage.subheading || ""}
                      onChange={(e) => {
                        const newHeroImages = [...section.data.heroImages];
                        newHeroImages[imageIndex] = {
                          ...newHeroImages[imageIndex],
                          subheading: e.target.value,
                        };
                        handleSectionDataChange(index, {
                          ...section.data,
                          heroImages: newHeroImages,
                        });
                      }}
                      placeholder="Enter subheading"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Redirect Path</Label>
                    <Input
                      type="text"
                      value={heroImage.redirectPath || ""}
                      onChange={(e) => {
                        const newHeroImages = [...section.data.heroImages];
                        newHeroImages[imageIndex] = {
                          ...newHeroImages[imageIndex],
                          redirectPath: e.target.value,
                        };
                        handleSectionDataChange(index, {
                          ...section.data,
                          heroImages: newHeroImages,
                        });
                      }}
                      placeholder="Enter redirect path (e.g., /products)"
                    />
                  </FormGroup>
                </HeroImageContainer>
              )
            )}

            <Button type="button" onClick={() => addHeroImage(index)}>
              Add Hero Image
            </Button>
          </SectionEditor>
        );
      case "hero":
        return (
          <SectionEditor key={index}>
            <SectionHeader>
              <SectionTitle>Banner Section</SectionTitle>
              <DeleteButton onClick={() => removeSection(index)}>
                Delete
              </DeleteButton>
            </SectionHeader>

            <HeroImageContainer>
              <FormGroup>
                <Label>Background Image</Label>
                <ImageUploader
                  onImageUpload={(imagePath) => {
                    handleSectionDataChange(index, {
                      ...section.data,
                      image: imagePath,
                    });
                  }}
                  currentImage={section.data.image}
                  onRemove={() => {
                    handleSectionDataChange(index, {
                      ...section.data,
                      image: undefined,
                    });
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Heading</Label>
                <Input
                  type="text"
                  value={section.data.heading || ""}
                  onChange={(e) => {
                    handleSectionDataChange(index, {
                      ...section.data,
                      heading: e.target.value,
                    });
                  }}
                  placeholder="Enter heading"
                />
              </FormGroup>

              <FormGroup>
                <Label>Subheading</Label>
                <Input
                  type="text"
                  value={section.data.subheading || ""}
                  onChange={(e) => {
                    handleSectionDataChange(index, {
                      ...section.data,
                      subheading: e.target.value,
                    });
                  }}
                  placeholder="Enter subheading"
                />
              </FormGroup>

              <FormGroup>
                <Label>Redirect Path</Label>
                <Input
                  type="text"
                  value={section.data.redirectPath || ""}
                  onChange={(e) => {
                    handleSectionDataChange(index, {
                      ...section.data,
                      redirectPath: e.target.value,
                    });
                  }}
                  placeholder="Enter redirect path (e.g., /products)"
                />
              </FormGroup>
            </HeroImageContainer>
          </SectionEditor>
        );

      case "imageGrid":
        return (
          <SectionEditor key={index}>
            <SectionHeader>
              <SectionTitle>Image Grid Section</SectionTitle>
              <DeleteButton onClick={() => removeSection(index)}>
                Delete
              </DeleteButton>
            </SectionHeader>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={section.data.title || ""}
                onChange={(e) =>
                  handleSectionDataChange(index, {
                    ...section.data,
                    title: e.target.value,
                  })
                }
                placeholder="Enter section title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={section.data.description || ""}
                onChange={(e) =>
                  handleSectionDataChange(index, {
                    ...section.data,
                    description: e.target.value,
                  })
                }
                placeholder="Enter section description"
              />
            </FormGroup>
            <FormGroup>
              <Label>Grid Images</Label>
              <GridContainer>
                {[1, 2, 3].map((num) => (
                  <ImageUploader
                    key={num}
                    onImageUpload={(imagePath) =>
                      handleSectionDataChange(index, {
                        ...section.data,
                        [`image${num}`]: imagePath,
                      })
                    }
                    currentImage={section.data[`image${num}`]}
                    onRemove={() =>
                      handleSectionDataChange(index, {
                        ...section.data,
                        [`image${num}`]: undefined,
                      })
                    }
                  />
                ))}
              </GridContainer>
            </FormGroup>
          </SectionEditor>
        );

      case "list":
        return (
          <SectionEditor key={index}>
            <SectionHeader>
              <SectionTitle>List Section</SectionTitle>
              <DeleteButton onClick={() => removeSection(index)}>
                Delete
              </DeleteButton>
            </SectionHeader>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={section.data.title || ""}
                onChange={(e) =>
                  handleSectionDataChange(index, {
                    ...section.data,
                    title: e.target.value,
                  })
                }
                placeholder="Enter section title"
              />
            </FormGroup>
            <FormGroup>
              <Label>List Items</Label>
              <ListContainer>
                {(section.data.items || []).map(
                  (item: string, itemIndex: number) => (
                    <ListItem key={itemIndex}>
                      <Input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(section.data.items || [])];
                          newItems[itemIndex] = e.target.value;
                          handleSectionDataChange(index, {
                            ...section.data,
                            items: newItems,
                          });
                        }}
                        placeholder={`List item ${itemIndex + 1}`}
                      />
                      <DeleteButton
                        onClick={() => {
                          const newItems = section.data.items.filter(
                            (_: any, i: number) => i !== itemIndex
                          );
                          handleSectionDataChange(index, {
                            ...section.data,
                            items: newItems,
                          });
                        }}
                      >
                        Remove
                      </DeleteButton>
                    </ListItem>
                  )
                )}
                <Button
                  type="button"
                  onClick={() =>
                    handleSectionDataChange(index, {
                      ...section.data,
                      items: [...(section.data.items || []), ""],
                    })
                  }
                >
                  Add Item
                </Button>
              </ListContainer>
            </FormGroup>
          </SectionEditor>
        );

      case "text":
        return (
          <SectionEditor key={index}>
            <SectionHeader>
              <SectionTitle>Text Section</SectionTitle>
              <DeleteButton onClick={() => removeSection(index)}>
                Delete
              </DeleteButton>
            </SectionHeader>
            <FormGroup>
              <Label>Title</Label>
              <Input
                type="text"
                value={section.data.title || ""}
                onChange={(e) =>
                  handleSectionDataChange(index, {
                    ...section.data,
                    title: e.target.value,
                  })
                }
                placeholder="Enter section title"
              />
            </FormGroup>
            <FormGroup>
              <Label>Content</Label>
              <TextArea
                value={section.data.content || ""}
                onChange={(e) =>
                  handleSectionDataChange(index, {
                    ...section.data,
                    content: e.target.value,
                  })
                }
                placeholder="Enter section content"
              />
            </FormGroup>
          </SectionEditor>
        );

      default:
        return null;
    }
  };

  return (
    <EditorContainer>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Page Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter page title"
            required
          />
        </FormGroup>

        <ButtonGroup>
          {sectionTypes.map((sectionType) => (
            <AddSectionButton
              key={sectionType.type}
              type="button"
              onClick={() => addSection(sectionType.type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{sectionType.icon}</span>
              {sectionType.label}
            </AddSectionButton>
          ))}
        </ButtonGroup>

        {sections.map((section, index) => renderSectionEditor(section, index))}

        <Button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Save Content
        </Button>
      </form>
    </EditorContainer>
  );
};

export default ContentEditor;
