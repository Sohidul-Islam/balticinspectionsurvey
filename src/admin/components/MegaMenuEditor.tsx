import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useMegaMenus,
  useCreateMegaMenu,
  useUpdateMegaMenu,
  useDeleteMegaMenu,
  type MegaMenu,
} from "../../services/menuApi";
import { FiPlus, FiEdit2, FiTrash2, FiList } from "react-icons/fi";
import { Loader } from "./Loader";
import { useNavigate } from "react-router-dom";
import { PathHelper, PathPreview } from "./MenuConsole";

const Container = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
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
`;

const MegaMenuList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MegaMenuItem = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  .content {
    padding: 0.5rem;
  }

  h3 {
    font-size: 1.2rem;
    color: #2d3436;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #636e72;
    font-family: monospace;
    font-size: 0.9rem;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f2f6;
`;

const EditButtons = styled.div`
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
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
    color: #2d3436;
  }

  &.edit {
    color: #0984e3;
    &:hover {
      background: rgba(9, 132, 227, 0.1);
    }
  }

  &.delete {
    color: #d63031;
    &:hover {
      background: rgba(214, 48, 49, 0.1);
    }
  }
`;

const ViewSubMenusButton = styled(motion.button)`
  padding: 0.8rem 1.2rem;
  background: linear-gradient(135deg, #0984e3, #00b894);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(9, 132, 227, 0.2);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(9, 132, 227, 0.3);
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.1rem;
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

type FormData = z.infer<typeof schema>;

interface MegaMenuEditorProps {
  menuId: number;
}

export const MegaMenuEditor = ({ menuId }: MegaMenuEditorProps) => {
  const [selectedMegaMenu, setSelectedMegaMenu] = useState<MegaMenu | null>(
    null
  );
  // const [expandedMegaMenu, setExpandedMegaMenu] = useState<number | null>(null);
  const { data: megaMenus, isLoading } = useMegaMenus(menuId);
  const createMegaMenu = useCreateMegaMenu(menuId);
  const updateMegaMenu = useUpdateMegaMenu(menuId);
  const deleteMegaMenu = useDeleteMegaMenu(menuId);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (selectedMegaMenu) {
        await updateMegaMenu.mutateAsync({
          ...data,
          id: selectedMegaMenu.id,
          menuId,
          enableQuickLink: false,
        });
      } else {
        await createMegaMenu.mutateAsync({
          ...data,
          menuId,
          enableQuickLink: false,
        });
      }
      reset();
      setSelectedMegaMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, megaMenuId: number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this mega menu?")) {
      try {
        await deleteMegaMenu.mutateAsync(megaMenuId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent, megaMenu: MegaMenu) => {
    e.stopPropagation();
    setSelectedMegaMenu(megaMenu);
    setValue("title", megaMenu.title);
    setValue("path", megaMenu.path);
  };

  const currentPath = watch("path");

  const handleCancel = () => {
    setSelectedMegaMenu(null);
    reset();
  };

  const handleViewSubMenus = (e: React.MouseEvent, megaMenu: MegaMenu) => {
    e.stopPropagation();
    navigate(`/admin/menus/${menuId}/mega-menu/${megaMenu.id}/sub-menus`);
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
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Title>
        Mega Menu
        {!selectedMegaMenu && (
          <Button
            onClick={() => setSelectedMegaMenu(null)}
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
                  placeholder="Enter mega menu path"
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
                  {selectedMegaMenu ? "Update" : "Create"}
                </Button>
                {selectedMegaMenu && (
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

            <MegaMenuList>
              <AnimatePresence>
                {megaMenus?.data.map((megaMenu) => (
                  <MegaMenuItem
                    key={megaMenu.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="content">
                      <h3>{megaMenu.title}</h3>
                      <p>{megaMenu.path}</p>
                    </div>

                    <ActionButtons>
                      <EditButtons>
                        <IconButton
                          className="edit"
                          onClick={(e) => handleEdit(e, megaMenu)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Edit"
                        >
                          <FiEdit2 />
                        </IconButton>
                        <IconButton
                          className="delete"
                          onClick={(e) => handleDelete(e, megaMenu.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Delete"
                        >
                          <FiTrash2 />
                        </IconButton>
                      </EditButtons>

                      <ViewSubMenusButton
                        onClick={(e) => handleViewSubMenus(e, megaMenu)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FiList /> Sub Menus
                      </ViewSubMenusButton>
                    </ActionButtons>
                  </MegaMenuItem>
                ))}
              </AnimatePresence>
            </MegaMenuList>
          </>
        )}
      </AnimatePresence>
    </Container>
  );
};
