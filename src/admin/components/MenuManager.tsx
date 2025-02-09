import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { menuService } from "../../services/api";

const Container = styled.div`
  padding: 2rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 0rem;
  }
`;


const MenuList = styled.div`
  margin-top: 2rem;
`;

const MenuItemContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SubMenuForm = styled.div`
  margin-left: 2rem;
  padding: 1rem;
  border-left: 2px solid #ddd;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
`;

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  background: #2d3436;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-right: 1rem;

  &.secondary {
    background: #636e72;
  }

  &.danger {
    background: #d63031;
  }
`;

interface MenuItem {
  id: string;
  title: string;
  path: string;
  submenus?: MenuItem[];
}

interface MenuForm {
  title: string;
  path: string;
}

const MenuManager = () => {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [menuForm, setMenuForm] = useState<MenuForm>({ title: "", path: "" });
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await menuService.getMenus();
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await menuService.createMenu(menuForm);
      fetchMenus();
      setMenuForm({ title: "", path: "" });
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  const handleAddSubmenu = async (parentId: string, submenu: MenuForm) => {
    try {
      await menuService.updateMenu(parentId, { submenu });
      fetchMenus();
    } catch (error) {
      console.error("Error adding submenu:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await menuService.deleteMenu(id);
        fetchMenus();
      } catch (error) {
        console.error("Error deleting menu:", error);
      }
    }
  };

  return (
    <Container>
      <h2>Menu Management</h2>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Menu Title</Label>
          <Input
            type="text"
            value={menuForm.title}
            onChange={(e) =>
              setMenuForm({ ...menuForm, title: e.target.value })
            }
            placeholder="Enter menu title"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Menu Path</Label>
          <Input
            type="text"
            value={menuForm.path}
            onChange={(e) => setMenuForm({ ...menuForm, path: e.target.value })}
            placeholder="Enter menu path"
            required
          />
        </FormGroup>

        <Button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Menu
        </Button>
      </form>

      <MenuList>
        {loading ? (
          <p>Loading menus...</p>
        ) : (
          (menus || [])?.map((menu) => (
            <MenuItemContainer key={menu.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3>{menu.title}</h3>
                <div>
                  <Button
                    className="secondary"
                    onClick={() =>
                      setSelectedMenu(menu.id === selectedMenu ? null : menu.id)
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {menu.id === selectedMenu ? "Cancel" : "Add Submenu"}
                  </Button>
                  <Button
                    className="danger"
                    onClick={() => handleDelete(menu.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              {menu.id === selectedMenu && (
                <SubMenuForm>
                  <FormGroup>
                    <Label>Submenu Title</Label>
                    <Input type="text" placeholder="Enter submenu title" />
                  </FormGroup>
                  <Button
                    onClick={() =>
                      handleAddSubmenu(menu.id, { title: "", path: "" })
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Submenu
                  </Button>
                </SubMenuForm>
              )}

              {menu.submenus && menu.submenus.length > 0 && (
                <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
                  {menu.submenus.map((submenu, index) => (
                    <MenuItemContainer key={index}>
                      <h4>{submenu.title}</h4>
                      <p>{submenu.path}</p>
                    </MenuItemContainer>
                  ))}
                </div>
              )}
            </MenuItemContainer>
          ))
        )}
      </MenuList>
    </Container>
  );
};

export default MenuManager;
