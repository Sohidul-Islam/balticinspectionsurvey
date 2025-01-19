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
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Loader } from "./Loader";

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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const MegaMenuItem = styled(motion.div)`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  position: relative;

  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: #636e72;
    font-family: monospace;
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

type FormData = z.infer<typeof schema>;

interface MegaMenuEditorProps {
  menuId: number;
}

export const MegaMenuEditor = ({ menuId }: MegaMenuEditorProps) => {
  const [selectedMegaMenu, setSelectedMegaMenu] = useState<MegaMenu | null>(
    null
  );
  const { data: megaMenus, isLoading } = useMegaMenus(menuId);
  const createMegaMenu = useCreateMegaMenu(menuId);
  const updateMegaMenu = useUpdateMegaMenu(menuId);
  const deleteMegaMenu = useDeleteMegaMenu(menuId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
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
        });
      } else {
        await createMegaMenu.mutateAsync({ ...data, menuId });
      }
      reset();
      setSelectedMegaMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (megaMenuId: number) => {
    if (window.confirm("Are you sure you want to delete this mega menu?")) {
      try {
        await deleteMegaMenu.mutateAsync(megaMenuId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (megaMenu: MegaMenu) => {
    setSelectedMegaMenu(megaMenu);
    setValue("title", megaMenu.title);
    setValue("path", megaMenu.path);
  };

  const handleCancel = () => {
    setSelectedMegaMenu(null);
    reset();
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
                <Input {...register("path")} error={!!errors.path} />
                {errors.path && (
                  <ErrorMessage>{errors.path.message}</ErrorMessage>
                )}
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <h3>{megaMenu.title}</h3>
                    <p>{megaMenu.path}</p>
                    <ActionButtons>
                      <IconButton
                        onClick={() => handleEdit(megaMenu)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiEdit2 />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(megaMenu.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FiTrash2 />
                      </IconButton>
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
