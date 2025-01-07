import { DemoRender } from "../types/GlobalTypes";

export const demoOfRender: DemoRender = {
  title: "Our Services",
  sections: [
    {
      type: "hero",
      data: {
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        heading: "Welcome to Our Services",
        subheading: "Explore what we offer",
      },
    },
    {
      type: "text",
      data: {
        heading: "Why Choose Us?",
        content:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        image:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        position: "right",
      },
    },
    {
      type: "imageGrid",
      data: {
        images: [
          {
            src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            title: "Shipments Tracking & Notify to the client",
            description: "",
          },
          {
            src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            title: "Container Seal Checking",
            description: "",
          },
          {
            src: "https://images.unsplash.com/photo-1506765515384-028b60a970df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            title: "Container Seal breaking",
            description: "",
          },
          {
            src: "https://images.unsplash.com/photo-1506765515384-028b60a970df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
            title: "Quantity Checked – devanning / Tallying",
            description: "",
          },
        ],
        // images: [
        //   "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        //   "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        //   "https://images.unsplash.com/photo-1506765515384-028b60a970df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
        // ],
        caption: "Our services at a glance",
      },
    },
    {
      type: "list",
      data: {
        heading: "Our Key Services",
        items: [
          "Assessment, Auditing, and Certification",
          "Digital Trust Assurance",
          "Sustainability Assurance",
        ],
      },
    },
  ],
};

export const footerData = {
  addresses: [
    "123 Main Street, Cityville, State, 12345",
    "456 Elm Avenue, Townsville, State, 67890",
  ],
  phones: ["+1-123-456-7890", "+1-987-654-3210"],
  email: "info@example.com",
  keyServices: [
    {
      title: "Website Development",
      description:
        "We create responsive and modern websites tailored to your business needs.",
      src: "https://images.unsplash.com/photo-1509223197845-458d87318791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Unsplash
    },
    {
      title: "Mobile App Development",
      description:
        "Our team develops user-friendly and high-performing mobile applications.",
      src: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Unsplash
    },
    {
      title: "Digital Marketing",
      description:
        "We help your business grow online with effective marketing strategies.",
      src: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Unsplash
    },
  ],
};
