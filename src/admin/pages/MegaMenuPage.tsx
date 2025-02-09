import { useState } from "react";
import styled from "styled-components";
import { useMenus } from "../../services/menuApi";
import { MegaMenuEditor } from "../components/MegaMenuEditor";
import { Loader } from "../components/Loader";

const Container = styled.div`
  padding: 2rem;
  @media (max-width: 768px) {
    padding: 0rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;


const MenuSelector = styled.div`
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;


const Select = styled.select`
  padding: 0.8rem;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
  @media (max-width: 768px) {
    min-width: 100%;
  }


  &:focus {
    outline: none;
    border-color: #74b9ff;
  }
`;

const NoMenuMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #636e72;
  font-size: 1.1rem;
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;



const MegaMenuPage = () => {
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const { data: menus, isLoading } = useMenus();

  if (isLoading) return <Loader />;

  return (
    <Container>
      <Title>Mega Menu Management</Title>

      <MenuSelector>
        <Select
          value={selectedMenuId || ""}
          onChange={(e) => setSelectedMenuId(Number(e.target.value) || null)}
        >
          <option value="">Select a menu</option>
          {menus?.data.map((menu) => (
            <option key={menu.id} value={menu.id}>
              {menu.title}
            </option>
          ))}
        </Select>
      </MenuSelector>

      {selectedMenuId ? (
        <MegaMenuEditor menuId={selectedMenuId} />
      ) : (
        <NoMenuMessage>
          Please select a menu to manage its mega menu items
        </NoMenuMessage>
      )}
    </Container>
  );
};

export default MegaMenuPage;
