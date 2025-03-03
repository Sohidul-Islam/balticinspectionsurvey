import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axios";
import { Content, useDeleteContent } from "../../services/contentApi";
import { Loader } from "../components/Loader";
import {
  useMenus,
  useMegaMenus,
  useSubMegaMenus,
} from "../../services/menuApi";
import { parseIfJson } from "../../utils";
import { SectionPreview, SectionType } from "../components/ContentPreviewSecondary";
import { sectionComponents } from "../../components/DynamicPage";

const Container = styled.div`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const NavigationPath = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #636e72;
  font-size: 0.9rem;

  span {
    color: #2d3436;
    font-weight: 500;
  }
`;

const SelectContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 0.5rem;
  }
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

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CreateButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: #00b894;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #00a187;
  }
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: 90vw; /* Single column by default (mobile first) */
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 450px); /* Two columns with 450px width each on larger screens */
    gap: 2rem; /* Adjust spacing between grid items */
  }
`;


const PageCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
`;

const PageTitle = styled.h3`
  font-size: 1.2rem;
  color: #2d3436;
  margin-bottom: 1rem;
`;

const SectionCount = styled.div`
  font-size: 0.9rem;
  color: #636e72;
  margin-bottom: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.edit {
    background: #74b9ff;
    color: white;

    &:hover {
      background: #0984e3;
    }
  }

  &.delete {
    background: #ff7675;
    color: white;

    &:hover {
      background: #d63031;
    }
  }
`;

const PageContentList = () => {
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);
  const [selectedMegaMenu, setSelectedMegaMenu] = useState<number | null>(null);
  const [selectedSubMenu, setSelectedSubMenu] = useState<number | null>(null);

  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const { data: megaMenus, isLoading: isLoadingMegaMenus } = useMegaMenus(
    selectedMenu || 0
  );
  const { data: subMenus, isLoading: isLoadingSubMenus } = useSubMegaMenus(
    selectedMenu || 0,
    selectedMegaMenu || 0
  );
  const { mutate: deleteContent } = useDeleteContent();

  const { data: pages } = useQuery<Content[]>({
    queryKey: ["pages", selectedMenu, selectedMegaMenu, selectedSubMenu],
    queryFn: async () => {
      let params = {};
    
      if (selectedSubMenu) {
        params = { subMegaMenuId: selectedSubMenu };
      } else if (selectedMegaMenu) {
        params = { megaMenuId: selectedMegaMenu };
      } else if (selectedMenu) {
        params = { menuId: selectedMenu };
      }
      
      const { data } = await axiosInstance.get("/api/content", {
        params: params
      });
      return data.data;
    },
    enabled: Boolean(selectedMenu || selectedMegaMenu || selectedSubMenu),
  });

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this page content?")) {
      try {
        deleteContent(id);
      } catch (error) {
        console.error("Error deleting page:", error);
      }
    }
  };

  const selectedMenuTitle = menus?.data.find(
    (m) => m.id === selectedMenu
  )?.title;
  const selectedMegaMenuTitle = megaMenus?.data.find(
    (m) => m.id === selectedMegaMenu
  )?.title;
  const selectedSubMenuTitle = subMenus?.data.find(
    (m) => m.id === selectedSubMenu
  )?.title;

  if (isLoadingMenus || isLoadingMegaMenus || isLoadingSubMenus) {
    return <Loader />;
  }

  return (
    <Container>
      <Header>
        <Title>Page Content</Title>
        <CreateButton to="/admin/content">
          <FiPlus /> Create New Content
        </CreateButton>
      </Header>

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
          onChange={(e) => setSelectedSubMenu(Number(e.target.value) || null)}
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

      {selectedMenu && selectedMegaMenu && selectedSubMenu && (
        <NavigationPath>
          <span>{selectedMenuTitle}</span>
          <FiChevronRight />
          <span>{selectedMegaMenuTitle}</span>
          <FiChevronRight />
          <span>{selectedSubMenuTitle}</span>
        </NavigationPath>
      )}

      <PageGrid>
        {pages?.map((page) => (
          <PageCard
            key={page.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PageTitle>{page.title}</PageTitle>
            <SectionCount>
               
                  <div
                    // axis="y"
                    // values={sections}
                    // onReorder={(value) => onReorder?.(value)}
                    style={{ padding: "0.5rem 0" }}
                  >
                    {parseIfJson(page.sections).map((section:any, index:number) => (
                      <SectionPreview key={section.type + index}>
                        <SectionType>{section.type}</SectionType>            
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
            </SectionCount>
            <ActionButtons>
              <ActionButton
                className="edit"
                onClick={() => {
                  window.location.href = `/admin/content/${page.id}`;
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEdit2 /> Edit Content
              </ActionButton>
              <ActionButton
                className="delete"
                onClick={() => handleDelete(page.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTrash2 /> Delete
              </ActionButton>
            </ActionButtons>
          </PageCard>
        ))}
      </PageGrid>
    </Container>
  );
};

export default PageContentList;
