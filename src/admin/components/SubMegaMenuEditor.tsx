import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useSubMegaMenus,
  useCreateSubMegaMenu,
  useUpdateSubMegaMenu,
  useDeleteSubMegaMenu,
  type SubMegaMenu,
} from "../../services/menuApi";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Loader } from "./Loader";
import { PathHelper, PathPreview } from "./MenuConsole";

const Container = styled(motion.div)`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Form = styled(motion.form)`
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: 0.8rem;
  border: 2px solid ${({ error }) => (error ? "#ff7675" : "#dfe6e9")};
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #74b9ff;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.delete {
    background: #ff7675;
  }

  &.cancel {
    background: #636e72;
  }
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;


const SubMenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const SubMenuItem = styled(motion.div)`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  p {
    margin: 0;
    color: #636e72;
    font-family: monospace;
    font-size: 0.9rem;
  }
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

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  path: z
    .string()
    .min(1, "Path is required")
    .regex(/^\/[a-z0-9-/]*$/, {
      message:
        "Path must start with / and can only contain lowercase letters, numbers, and hyphens",
    }),
});

interface SubMegaMenuEditorProps {
  menuId: number;
  megaMenuId: number;
}

export const SubMegaMenuEditor = ({
  menuId,
  megaMenuId,
}: SubMegaMenuEditorProps) => {
  const [selectedSubMenu, setSelectedSubMenu] = useState<SubMegaMenu | null>(
    null
  );
  const { data: subMenus, isLoading } = useSubMegaMenus(menuId, megaMenuId);
  const createSubMenu = useCreateSubMegaMenu(menuId, megaMenuId);
  const updateSubMenu = useUpdateSubMegaMenu(menuId, megaMenuId);
  const deleteSubMenu = useDeleteSubMegaMenu(menuId, megaMenuId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const currentPath = watch("path");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      if (selectedSubMenu) {
        await updateSubMenu.mutateAsync({
          ...data,
          id: selectedSubMenu.id,
          menuId,
          megaMenuId,
          enableQuickLink: false,
        });
      } else {
        await createSubMenu.mutateAsync({
          ...data,
          menuId,
          megaMenuId,
          enableQuickLink: false,
        });
      }
      reset();
      setSelectedSubMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, subMenuId: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this sub menu?")) {
      try {
        await deleteSubMenu.mutateAsync(subMenuId);
        if (selectedSubMenu?.id === subMenuId) {
          setSelectedSubMenu(null);
          reset();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (subMenu: SubMegaMenu) => {
    setSelectedSubMenu(subMenu);
    setValue("title", subMenu.title);
    setValue("path", subMenu.path);
  };

  const handleCancel = () => {
    setSelectedSubMenu(null);
    reset();
  };

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

  return (
    <Container>
      <Title>
        Sub Mega Menu
        {!selectedSubMenu && (
          <Button
            onClick={() => setSelectedSubMenu(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlus /> Add New
          </Button>
        )}
      </Title>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Form
              onSubmit={handleSubmit(onSubmit)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FormGroup>
                <Label>Title</Label>
                <Input {...register("title")} error={!!errors.title} />
                {errors.title && (
                  <ErrorMessage>{errors.title.message}</ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Path</Label>
                <Input
                  {...register("path")}
                  error={!!errors.path}
                  placeholder="Enter sub mega menu path"
                  onChange={handlePathChange}
                />
                {errors.path && (
                  <ErrorMessage>{errors.path.message as string}</ErrorMessage>
                )}
                <PathHelper>
                  Path should start with / and can contain lowercase letters,
                  numbers, and hyphens
                </PathHelper>
                <PathPreview>Preview: {currentPath}</PathPreview>
              </FormGroup>

              <div style={{ display: "flex", gap: "1rem" }}>
                <Button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedSubMenu ? "Update" : "Create"}
                </Button>
                {selectedSubMenu && (
                  <Button
                    type="button"
                    className="cancel"
                    onClick={handleCancel}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </Form>

            <SubMenuList>
              <AnimatePresence>
                {subMenus?.data.map((subMenu) => (
                  <SubMenuItem
                    key={subMenu.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <h4>{subMenu.title}</h4>
                    <p>{subMenu.path}</p>
                    <ActionButtons>
                      <IconButton
                        onClick={() => handleEdit(subMenu)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEdit2 />
                      </IconButton>
                      <IconButton
                        onClick={(e) => handleDelete(e, subMenu.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </ActionButtons>
                  </SubMenuItem>
                ))}
              </AnimatePresence>
            </SubMenuList>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};
