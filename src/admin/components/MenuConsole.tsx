import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  type Menu,
} from "../../services/menuApi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  font-weight: 700;
`;

const Form = styled(motion.form)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3436;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = styled.input.attrs<InputProps>((props) => ({
  type: props.type || "text",
}))<InputProps>`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${({ error }) => (error ? "#ff7675" : "#dfe6e9")};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #74b9ff;
    box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.2);
  }
`;

const ErrorMessage = styled.span`
  color: #ff7675;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
`;

const Button = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #74b9ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    background: #b2bec3;
    cursor: not-allowed;
  }
`;

const MenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #636e72;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #2d3436;
  }
`;

const MenuCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Toggle = styled.input`
  appearance: none;
  width: 50px;
  height: 28px;
  background: #e5e7eb;
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:checked {
    background: #10b981;
  }

  &:before {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    background: white;
    transition: all 0.3s ease;
  }

  &:checked:before {
    transform: translateX(22px);
  }
`;

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^\/[a-z0-9-/]*$/, {
      message:
        "Path must start with / and can only contain lowercase letters, numbers, hyphens, and forward slashes",
    })
    .refine((value) => !value.includes("//"), {
      message: "Path cannot contain consecutive forward slashes",
    })
    .refine((value) => !value.endsWith("/") || value === "/", {
      message: "Path cannot end with a forward slash (except root path)",
    })
    .transform((value) => value.toLowerCase()),
  enableQuickLink: z.boolean().default(false),
});

type FormData = z.infer<typeof schema>;

export const PathPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f1f2f6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #2d3436;
`;

export const PathHelper = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #636e72;
`;

const MenuConsole = () => {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      path: "/",
      enableQuickLink: false,
    },
  });

  // Watch the path value for preview
  const currentPath = watch("path");

  // Update form when a menu is selected
  useEffect(() => {
    if (selectedMenu) {
      setValue("title", selectedMenu.title);
      setValue("path", selectedMenu.path);
      setValue("enableQuickLink", selectedMenu.enableQuickLink);
    }
  }, [selectedMenu, setValue]);

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Ensure path starts with /
    if (!value.startsWith("/")) {
      value = "/" + value;
    }

    // Remove spaces and convert to lowercase
    value = value.replace(/\s+/g, "-").toLowerCase();

    setValue("path", value);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (selectedMenu) {
        await updateMenu.mutateAsync({ ...data, id: selectedMenu.id });
      } else {
        await createMenu.mutateAsync(data);
      }
      reset({ title: "", path: "/" });
      setSelectedMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setSelectedMenu(null);
    reset({ title: "", path: "/", enableQuickLink: false });
  };

  const handleDelete = async (e: React.MouseEvent, menuId: number) => {
    e.stopPropagation(); // Prevent menu selection when clicking delete
    if (window.confirm("Are you sure you want to delete this menu?")) {
      try {
        await deleteMenu.mutateAsync(menuId);
        if (selectedMenu?.id === menuId) {
          setSelectedMenu(null);
          reset({ title: "", path: "/", enableQuickLink: false });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (menu: Menu) => {
    setSelectedMenu(menu);
    setValue("title", menu.title);
    setValue("path", menu.path);
  };

  return (
    <Container>
      <Header>
        <Title>Menu Management</Title>
      </Header>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FormGroup>
          <Label>Title</Label>
          <Input
            {...register("title")}
            error={!!errors.title}
            placeholder="Enter menu title"
          />
          {errors.title && (
            <ErrorMessage>{errors.title.message as string}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Path</Label>
          <Input
            {...register("path")}
            error={!!errors.path}
            placeholder="Enter menu path"
            onChange={handlePathChange}
          />
          {errors.path && (
            <ErrorMessage>{errors.path.message as string}</ErrorMessage>
          )}
          <PathHelper>
            Path should start with / and can contain lowercase letters, numbers,
            and hyphens
          </PathHelper>
          <PathPreview>Preview: {currentPath}</PathPreview>
        </FormGroup>

        <FormGroup>
          <Label>Enable Quick Link</Label>
          <ToggleWrapper>
            <Toggle
              type="checkbox"
              checked={watch("enableQuickLink")}
              onChange={(e) => setValue("enableQuickLink", e.target.checked)}
            />
            <span>Show in Quick Links section</span>
          </ToggleWrapper>
        </FormGroup>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={createMenu.isPending || updateMenu.isPending}
          >
            {selectedMenu ? "Update Menu" : "Create Menu"}
          </Button>

          {selectedMenu && (
            <Button
              type="button"
              onClick={handleCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ background: "#636e72" }}
            >
              Cancel
            </Button>
          )}
        </div>
      </Form>

      <MenuList>
        <AnimatePresence>
          {isLoadingMenus ? (
            <div>Loading...</div>
          ) : (
            (menus?.data || [])?.map((menu) => (
              <MenuCard
                key={menu?.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>{menu?.title}</h3>
                <p style={{ fontFamily: "monospace" }}>{menu?.path}</p>
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.875rem",
                    color: menu?.enableQuickLink ? "#10b981" : "#6b7280",
                  }}
                >
                  {menu?.enableQuickLink
                    ? "Quick Link Enabled"
                    : "Quick Link Disabled"}
                </div>
                <ActionButtons>
                  <IconButton
                    onClick={() => handleEdit(menu)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiEdit2 />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleDelete(e, menu.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiTrash2 />
                  </IconButton>
                </ActionButtons>
              </MenuCard>
            ))
          )}
        </AnimatePresence>
      </MenuList>
    </Container>
  );
};

export default MenuConsole;
