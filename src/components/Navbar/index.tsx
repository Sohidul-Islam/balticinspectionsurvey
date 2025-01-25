import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Logo from "../../assets/balticlogo.svg?react";
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import {
  useMenus,
  useMegaMenus,
  useSubMegaMenus,
} from "../../services/menuApi";
import { Loader } from "../../admin/components/Loader";

const NavContainer = styled.nav<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${({ scrolled }) =>
    scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent"};
  backdrop-filter: ${({ scrolled }) => (scrolled ? "blur(10px)" : "none")};
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: ${({ scrolled }) =>
    scrolled ? "0 2px 15px rgba(0, 0, 0, 0.1)" : "none"};
`;

const NavContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  transition: padding 0.3s ease;

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
  }
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 1001;

  svg {
    height: 50px;
    width: auto;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const MenuContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  position: relative;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MenuItem = styled.div`
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #2d3436 0%, #636e72 100%);
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 100%;
  }
`;

const MenuTitle = styled(motion.div)`
  font-size: 1.1rem;
  color: #2d3436;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    color: #1e90ff;
    background: rgba(30, 144, 255, 0.1);
  }
`;

const MegaMenuContainer = styled(motion.div)`
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 1000;

  &[data-visible="true"] {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    top: 120%;
  }

  @media (max-width: 1200px) {
    width: 600px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MegaMenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  min-height: 300px;
`;

const MegaMenuSection = styled.div`
  h3 {
    font-size: 1.2rem;
    color: #2d3436;
    margin-bottom: 1.2rem;
    font-weight: 600;
    position: relative;
    padding-bottom: 0.5rem;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #1e90ff 0%, #00bfff 100%);
      border-radius: 2px;
    }
  }
`;

const SubMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #636e72;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin-bottom: 0.3rem;

  &:hover {
    color: #1e90ff;
    background: rgba(30, 144, 255, 0.1);
    transform: translateX(5px);
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #2d3436;
  z-index: 1001;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 300px;
  background: white;
  padding: 2rem;
  z-index: 1001;
  overflow-y: auto;
  height: 100vh;
  overscroll-behavior: contain;
`;

const MobileMenuItem = styled(motion.div)`
  margin-bottom: 1rem;
`;

const MobileMenuTitle = styled.div`
  font-size: 1.2rem;
  color: #2d3436;
  padding: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }
`;

const MobileMegaMenu = styled(motion.div)`
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #f1f2f6;
  overflow: hidden;
`;

const MobileMegaMenuTitle = styled.div`
  font-size: 1.1rem;
  color: #636e72;
  padding: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    transition: transform 0.3s ease;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

const LoaderWrapper = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [mobileMenuId, setMobileMenuId] = useState<number | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const [expandedMegaMenu, setExpandedMegaMenu] = useState<number | null>(null);

  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const { data: megaMenus, isLoading: isLoadingMegaMenus } = useMegaMenus(
    hoveredMenu || mobileMenuId || 0
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen && (menus?.data?.length || 0) > 0) {
      setMobileMenuId(menus?.data[0].id || null);
    } else {
      setMobileMenuId(null);
    }
  }, [mobileMenuOpen, menus?.data]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  if (isLoadingMenus) {
    return (
      <NavContainer scrolled={scrolled}>
        <NavContent>
          <LogoContainer to="/">
            <Logo />
          </LogoContainer>
          <LoaderWrapper>
            <Loader />
          </LoaderWrapper>
        </NavContent>
      </NavContainer>
    );
  }

  return (
    <NavContainer scrolled={scrolled}>
      <NavContent>
        <LogoContainer to="/">
          <Logo />
        </LogoContainer>

        <MenuContainer>
          {menus?.data.map((menu) => (
            <MenuItem
              key={menu.id}
              onMouseEnter={() => setHoveredMenu(menu.id)}
              // Removed to prevent setting hovered menu to null on mouse leave
            >
              <NavLink to={menu?.path}>
                <MenuTitle
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {menu.title}
                </MenuTitle>
              </NavLink>
            </MenuItem>
          ))}

          <MegaMenuContainer data-visible={!!hoveredMenu}>
            <AnimatePresence mode="wait">
              {hoveredMenu && megaMenus?.data && (
                <MegaMenuGrid
                  as={motion.div}
                  key={hoveredMenu}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {megaMenus.data.map((megaMenu) => (
                    <MegaMenuSection key={megaMenu.id}>
                      <NavLink to={megaMenu?.path}>
                        <h3>{megaMenu.title}</h3>
                      </NavLink>
                      <SubMegaMenuList
                        menuId={hoveredMenu}
                        megaMenuId={megaMenu.id}
                      />
                    </MegaMenuSection>
                  ))}
                </MegaMenuGrid>
              )}
            </AnimatePresence>
          </MegaMenuContainer>
        </MenuContainer>

        <MobileMenuButton
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <MobileMenuOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileMenu
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 20 }}
              >
                {menus?.data.map((menu) => (
                  <MobileMenuItem key={menu.id}>
                    <MobileMenuTitle
                      onClick={() =>
                        setExpandedMenu(
                          expandedMenu === menu.id ? null : menu.id
                        )
                      }
                    >
                      {menu.title}
                      <motion.div
                        animate={{ rotate: expandedMenu === menu.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FiChevronDown />
                      </motion.div>
                    </MobileMenuTitle>

                    <AnimatePresence>
                      {expandedMenu === menu.id &&
                        megaMenus?.data
                          ?.filter((megaMenu) => megaMenu.menuId === menu.id)
                          .map((megaMenu) => (
                            <MobileMegaMenu
                              key={megaMenu.id}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <MobileMegaMenuTitle
                                onClick={() =>
                                  setExpandedMegaMenu(
                                    expandedMegaMenu === megaMenu.id
                                      ? null
                                      : megaMenu.id
                                  )
                                }
                              >
                                {megaMenu.title}
                                <motion.div
                                  animate={{
                                    rotate:
                                      expandedMegaMenu === megaMenu.id
                                        ? 180
                                        : 0,
                                  }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <FiChevronDown />
                                </motion.div>
                              </MobileMegaMenuTitle>

                              <AnimatePresence>
                                {expandedMegaMenu === megaMenu.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <SubMegaMenuList
                                      menuId={menu.id}
                                      megaMenuId={megaMenu.id}
                                      isMobile={true}
                                    />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </MobileMegaMenu>
                          ))}
                    </AnimatePresence>
                  </MobileMenuItem>
                ))}
              </MobileMenu>
            </>
          )}
        </AnimatePresence>
      </NavContent>
    </NavContainer>
  );
};

interface SubMegaMenuListProps {
  menuId: number;
  megaMenuId: number;
  isMobile?: boolean;
}

const SubMegaMenuList: React.FC<SubMegaMenuListProps> = ({
  menuId,
  megaMenuId,
  isMobile = false,
}) => {
  const { data: subMenus, isLoading } = useSubMegaMenus(menuId, megaMenuId);

  if (isLoading) return <Loader />;

  return (
    <>
      {subMenus?.data.map((subMenu) => (
        <SubMenuItem
          key={subMenu.id}
          to={subMenu.path}
          // onClick={() => {
          //   if (isMobile) {
          //     setMobileMenuOpen && setMobileMenuOpen(false);
          //   }
          // }}
          style={
            isMobile
              ? {
                  padding: "0.6rem 0",
                  fontSize: "0.9rem",
                  marginBottom: 0,
                }
              : undefined
          }
        >
          {subMenu.title}
        </SubMenuItem>
      ))}
    </>
  );
};

export default Navbar;
