import styled from "styled-components";
import { Link, Outlet } from "react-router-dom";

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  background: #2d3436;
  color: white;
  padding: 2rem;
`;

const Content = styled.main`
  padding: 2rem;
  background: #f8f9fa;
`;

const AdminLayout = () => {
  return (
    <Container>
      <Sidebar>
        <nav>
          <Link to="/admin/menus">Menus</Link>
          <Link to="/admin/pages">Pages</Link>
        </nav>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default AdminLayout;
