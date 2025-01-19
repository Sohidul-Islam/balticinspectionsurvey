import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiHome,
  FiList,
  FiLayout,
  FiSettings,
  FiChevronDown,
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

const NavItemContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const SubMenu = styled(motion.div)`
  margin-left: 2.5rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SubMenuItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: ${({ $active }) => ($active ? "#74b9ff" : "rgba(255, 255, 255, 0.7)")};
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #74b9ff;
  }
`;

const NavItemButton = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;
  background: none;
  border: none;
  color: ${({ $active }) => ($active ? "#74b9ff" : "white")};
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #74b9ff;
  }

  .icon-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
`;

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();

  const navItems = [
    { path: "/admin", icon: <FiHome />, text: "Dashboard" },
    {
      text: "Menu Management",
      icon: <FiList />,
      items: [
        { path: "/admin/menus", text: "Menus" },
        { path: "/admin/menus/mega-menu", text: "Mega Menu" },
      ],
    },
    { path: "/admin/pages", icon: <FiLayout />, text: "Pages" },
    { path: "/admin/settings", icon: <FiSettings />, text: "Settings" },
  ];

  const handleMenuClick = (text: string) => {
    setExpandedMenu(expandedMenu === text ? null : text);
  };

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
            <NavItemContainer key={item.text}>
              {"items" in item ? (
                <>
                  <NavItemButton
                    $active={item.items.some(
                      (subItem) => location.pathname === subItem.path
                    )}
                    onClick={() => handleMenuClick(item.text)}
                  >
                    <div className="icon-container">
                      {item.icon}
                      <NavText $isCollapsed={isCollapsed}>{item.text}</NavText>
                    </div>
                    {!isCollapsed && (
                      <ChevronIcon
                        animate={{
                          rotate: expandedMenu === item.text ? 180 : 0,
                        }}
                      >
                        <FiChevronDown />
                      </ChevronIcon>
                    )}
                  </NavItemButton>
                  <AnimatePresence>
                    {!isCollapsed && expandedMenu === item.text && (
                      <SubMenu
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {item.items.map((subItem) => (
                          <SubMenuItem
                            key={subItem.path}
                            to={subItem.path}
                            $active={location.pathname === subItem.path}
                          >
                            {subItem.text}
                          </SubMenuItem>
                        ))}
                      </SubMenu>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavItem
                  to={item.path}
                  $active={location.pathname === item.path}
                >
                  {item.icon}
                  <NavText $isCollapsed={isCollapsed}>{item.text}</NavText>
                </NavItem>
              )}
            </NavItemContainer>
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
