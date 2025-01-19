import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiHome,
  FiList,
  FiLayout,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useState } from "react";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
`;

const Sidebar = styled(motion.aside)<{ $isCollapsed: boolean }>`
  background: #2d3436;
  color: white;
  width: ${({ $isCollapsed }) => ($isCollapsed ? "80px" : "250px")};
  transition: width 0.3s ease;
  padding: 2rem 1rem;
`;

const Content = styled.main`
  padding: 2rem;
  background: #f8f9fa;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding: 0 1rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: ${({ $active }) => ($active ? "#74b9ff" : "white")};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #74b9ff;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const NavText = styled.span<{ $isCollapsed: boolean }>`
  opacity: ${({ $isCollapsed }) => ($isCollapsed ? 0 : 1)};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`;

const ToggleButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: <FiHome />, text: "Dashboard" },
    { path: "/admin/menus", icon: <FiList />, text: "Menus" },
    { path: "/admin/pages", icon: <FiLayout />, text: "Pages" },
    { path: "/admin/settings", icon: <FiSettings />, text: "Settings" },
  ];

  return (
    <Container>
      <Sidebar
        $isCollapsed={isCollapsed}
        initial={false}
        animate={{ width: isCollapsed ? 80 : 250 }}
      >
        <ToggleButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiMenu />
        </ToggleButton>

        <Logo>{!isCollapsed && <span>Admin</span>}</Logo>

        <nav>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $active={location.pathname === item.path}
            >
              {item.icon}
              <NavText $isCollapsed={isCollapsed}>{item.text}</NavText>
            </NavItem>
          ))}
        </nav>
      </Sidebar>

      <Content>
        <Outlet />
      </Content>
    </Container>
  );
};

export default AdminLayout;
