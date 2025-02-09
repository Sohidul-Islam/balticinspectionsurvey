import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiHome,
  FiList,
  FiSettings,
  FiChevronDown,
  FiFileText,
  FiEdit2,
  FiMessageSquare,
  FiUsers,
} from "react-icons/fi";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";
import { BiLogOut } from "react-icons/bi";

const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled(motion.aside)<{ $isCollapsed: boolean; $isMobile?: boolean }>`
  background: #2d3436;
  color: white;
  width: ${({ $isCollapsed }) => ($isCollapsed ? "80px" : "250px")};
  transition: width 0.3s ease;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    position: fixed;
    left: ${({ $isMobile }) => ($isMobile ? "-100%" : "0")};
    width: 250px;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
`;

const Content = styled.main`
  padding: 2rem;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding: 1rem;
  }
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

const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #2d3436;
    color: white;
    position: sticky;
    top: 0;
    z-index: 999;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Overlay = styled(motion.div)`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const location = useLocation();

  const { logout } = useAuth();

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
    {
      path: "/admin/pages/content",
      icon: <FiFileText />,
      text: "Page Content",
    },
    { path: "/admin/content", icon: <FiEdit2 />, text: "Content Editor" },
    { path: "/admin/inquiry", icon: <FiMessageSquare />, text: "Inquiry" },
    { path: "/admin/users", icon: <FiUsers />, text: "Users" },
    { path: "/admin/footer", icon: <FiSettings />, text: "Footer" },
    // { path: "/admin/settings", icon: <FiSettings />, text: "Settings" },
  ];

  const handleMenuClick = (text: string) => {
    setExpandedMenu(expandedMenu === text ? null : text);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <MobileHeader>
        <MobileMenuButton onClick={toggleMobileMenu}>
          <FiMenu />
        </MobileMenuButton>
        <span>Admin Dashboard</span>
      </MobileHeader>

      <Container>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
          )}
        </AnimatePresence>

        <Sidebar
          $isCollapsed={isCollapsed}
          $isMobile={!isMobileMenuOpen}
          initial={false}
          animate={{ 
            width: isCollapsed ? 80 : 250,
            x: isMobileMenuOpen ? 0 : (window.innerWidth <= 768 ? -250 : 0)
          }}
        >
          <ToggleButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{ display: window.innerWidth <= 768 ? 'none' : 'flex' }}
          >
            <FiMenu />
          </ToggleButton>

          <Logo>{!isCollapsed && <span>Admin</span>}</Logo>

          <nav onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => (
              <NavItemContainer key={item.text}>
                {"items" in item ? (
                  <>
                    <NavItemButton
                      $active={item?.items?.some(
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
                          {item?.items?.map((subItem) => (
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

            <NavItemButton onClick={() => logout()}>
              <div className="icon-container">
                <BiLogOut />
                <NavText $isCollapsed={false}>Log out</NavText>
              </div>
            </NavItemButton>
          </nav>
        </Sidebar>

        <Content>
          <Outlet />
        </Content>
      </Container>
    </>
  );
};

export default AdminLayout;
