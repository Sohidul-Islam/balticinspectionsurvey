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
  type Menu,
} from "../../services/menuApi";

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

const MenuCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
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
});

type FormData = z.infer<typeof schema>;

const PathPreview = styled.div`
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f1f2f6;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #2d3436;
`;

const PathHelper = styled.div`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #636e72;
`;

const MenuConsole = () => {
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const { data: menus, isLoading: isLoadingMenus } = useMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();

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
    },
  });

  // Watch the path value for preview
  const currentPath = watch("path");

  // Update form when a menu is selected
  useEffect(() => {
    if (selectedMenu) {
      setValue("title", selectedMenu.title);
      setValue("path", selectedMenu.path);
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
    reset({ title: "", path: "/" });
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
                onClick={() => setSelectedMenu(menu)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3>{menu?.title}</h3>
                <p style={{ fontFamily: "monospace" }}>{menu?.path}</p>
              </MenuCard>
            ))
          )}
        </AnimatePresence>
      </MenuList>
    </Container>
  );
};

export default MenuConsole;
