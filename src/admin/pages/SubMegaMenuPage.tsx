import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useMenus, useMegaMenus } from "../../services/menuApi";
import { SubMegaMenuEditor } from "../components/SubMegaMenuEditor";
import { Loader } from "../components/Loader";
import { FiArrowLeft } from "react-icons/fi";

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #636e72;
  font-size: 0.9rem;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  h1 {
    font-size: 2rem;
    color: #2d3436;
    margin: 0;
  }
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #636e72;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #2d3436;
  }
`;

const SubMegaMenuPage = () => {
  const { menuId, megaMenuId } = useParams();
  const navigate = useNavigate();
  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const { data: megaMenus, isLoading: isLoadingMegaMenus } = useMegaMenus(
    Number(menuId)
  );

  const menu = menus?.data.find((m) => m.id === Number(menuId));
  const megaMenu = megaMenus?.data.find((m) => m.id === Number(megaMenuId));

  if (isLoadingMenus || isLoadingMegaMenus) return <Loader />;

  return (
    <Container>
      <Header>
        <Breadcrumb>
          <span>Menus</span> / <span>{menu?.title}</span> /{" "}
          <span>{megaMenu?.title}</span>
        </Breadcrumb>
        <Title>
          <BackButton
            onClick={() => navigate(-1)}
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft /> Back
          </BackButton>
          <h1>Sub Mega Menu Management</h1>
        </Title>
      </Header>

      {menuId && megaMenuId && (
        <SubMegaMenuEditor
          menuId={Number(menuId)}
          megaMenuId={Number(megaMenuId)}
        />
      )}
    </Container>
  );
};

export default SubMegaMenuPage;
