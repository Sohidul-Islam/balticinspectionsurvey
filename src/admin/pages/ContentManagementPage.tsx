import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  useMenus,
  useMegaMenus,
  useSubMegaMenus,
} from "../../services/menuApi";
import {
  useCreateContent,
  useUpdateContent,
  Section,
} from "../../services/contentApi";
import { Loader } from "../components/Loader";
import ContentEditor from "../components/ContentEditor";
import ContentPreview from "../components/ContentPreview";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 1rem;
`;

const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
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

const ContentManagementPage = () => {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [selectedMegaMenu, setSelectedMegaMenu] = useState<number | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<number | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const { data: megaMenus, isLoading: isLoadingMegaMenus } = useMegaMenus(
    selectedMenu || 0
  );
  const { data: subMenus, isLoading: isLoadingSubMenus } = useSubMegaMenus(
    selectedMenu || 0,
    selectedMegaMenu || 0
  );

  const createContent = useCreateContent();
  const updateContent = useUpdateContent();

  const handleSave = async (contentData: any) => {
    if (!selectedMenu && !selectedMegaMenu && !selectedSubMenu) {
      toast.error("Please select a menu level");
      return;
    }

    try {
      const result = await createContent.mutateAsync({
        ...contentData,
        menuId: selectedMenu,
        megaMenuId: selectedMegaMenu,
        subMegaMenuId: selectedSubMenu,
      });

      // Update sections state with the saved content
      if (result.data?.sections) {
        setSections(result.data.sections);
      }
    } catch (error) {
      console.error("Error saving content:", error);
    }
    setSections(contentData.sections);
  };

  const handleReorder = (newOrder: Section[]) => {
    setSections(newOrder);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    // Scroll to editor
    document.querySelector(".content-editor")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handlePreview = () => {
    // Implement preview in new tab or modal
  };

  if (isLoadingMenus || isLoadingMegaMenus || isLoadingSubMenus) {
    return <Loader />;
  }

  return (
    <Container>
      <div>
        <Header>
          <Title>Content Management</Title>
          <SelectContainer>
            <Select
              value={selectedMenu || ""}
              onChange={(e) => {
                setSelectedMenu(Number(e.target.value) || null);
                setSelectedMegaMenu(null);
                setSelectedSubMenu(null);
              }}
            >
              <option value="">Select Menu</option>
              {menus?.data.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.title}
                </option>
              ))}
            </Select>

            <Select
              value={selectedMegaMenu || ""}
              onChange={(e) => {
                setSelectedMegaMenu(Number(e.target.value) || null);
                setSelectedSubMenu(null);
              }}
              disabled={!selectedMenu}
            >
              <option value="">Select Mega Menu</option>
              {megaMenus?.data.map((megaMenu) => (
                <option key={megaMenu.id} value={megaMenu.id}>
                  {megaMenu.title}
                </option>
              ))}
            </Select>

            <Select
              value={selectedSubMenu || ""}
              onChange={(e) =>
                setSelectedSubMenu(Number(e.target.value) || null)
              }
              disabled={!selectedMegaMenu}
            >
              <option value="">Select Sub Menu</option>
              {subMenus?.data.map((subMenu) => (
                <option key={subMenu.id} value={subMenu.id}>
                  {subMenu.title}
                </option>
              ))}
            </Select>
          </SelectContainer>
        </Header>

        <div className="content-editor">
          <ContentEditor
            onSave={handleSave}
            initialContent={{
              title: "",
              sections: editingIndex !== null ? [sections[editingIndex]] : [],
            }}
          />
        </div>
      </div>

      <ContentPreview
        sections={sections}
        onReorder={handleReorder}
        onEdit={handleEdit}
        onPreview={handlePreview}
      />
    </Container>
  );
};

export default ContentManagementPage;
