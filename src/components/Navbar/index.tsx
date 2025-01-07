import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Logo from "../../assets/balticlogo.svg?react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

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

const MegaMenu = styled(motion.div)`
  position: absolute;
  top: 130%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  min-width: 600px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;

  ${MenuItem}:hover & {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    top: 120%;
  }

  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 2px;
  }
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
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    background: rgba(255, 255, 255, 0.98);
    padding: 5rem 2rem 2rem;
    overflow-y: auto;
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

const MobileMenuItem = styled(motion.div)`
  margin-bottom: 2rem;
`;

const MobileMenuTitle = styled.h2`
  font-size: 1.5rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const MobileSubMenu = styled(motion.div)`
  padding-left: 1rem;
  border-left: 2px solid #f1f2f6;
`;

const menuData = [
  {
    id: 1,
    title: "Our Services",
    megaMenu: [
      {
        title: "Business Assurance",
        items: [
          "Assessment, Auditing and Certification",
          "Assurance and Verification Services",
          "Digital Trust Assurance",
        ],
      },
      {
        title: "Connectivity & Products",
        items: ["Automotive", "Connectivity", "Cybersecurity"],
      },
    ],
  },
  {
    id: 2,
    title: "About Us",
    megaMenu: [
      {
        title: "Our Team",
        items: ["Leadership", "Careers", "Contact"],
      },
      {
        title: "Company Info",
        items: ["History", "Mission", "Values"],
      },
      {
        title: "test Info",
        items: ["History", "Mission", "Values"],
      },
    ],
  },
  {
    id: 3,
    title: "About Us",
    megaMenu: [
      {
        title: "Our Team",
        items: ["Leadership", "Careers", "Contact"],
      },
      {
        title: "Company Info",
        items: ["History", "Mission", "Values"],
      },
      {
        title: "test Info",
        items: ["History", "Mission", "Values"],
      },
    ],
  },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <NavContainer scrolled={scrolled}>
      <NavContent>
        <LogoContainer to="/">
          <Logo />
        </LogoContainer>

        <MenuContainer>
          {menuData.map((menu) => (
            <MenuItem key={menu.id}>
              <MenuTitle
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {menu.title}
              </MenuTitle>

              {menu.megaMenu && (
                <MegaMenu>
                  {menu.megaMenu.map((section, index) => (
                    <MegaMenuSection key={index}>
                      <h3>{section.title}</h3>
                      {section.items.map((item, idx) => (
                        <SubMenuItem
                          key={idx}
                          to={`/${menu.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/${section.title
                            .toLowerCase()
                            .replace(/\s+/g, "-")}/${item
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {item}
                        </SubMenuItem>
                      ))}
                    </MegaMenuSection>
                  ))}
                </MegaMenu>
              )}
            </MenuItem>
          ))}
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
                {menuData.map((menu) => (
                  <MobileMenuItem
                    key={menu.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <MobileMenuTitle>{menu.title}</MobileMenuTitle>
                    {menu.megaMenu?.map((section) => (
                      <MobileSubMenu
                        key={section.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3>{section.title}</h3>
                        {section.items.map((item) => (
                          <SubMenuItem
                            key={item}
                            to={`/${menu.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/${section.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")}/${item
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item}
                          </SubMenuItem>
                        ))}
                      </MobileSubMenu>
                    ))}
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

export default Navbar;
