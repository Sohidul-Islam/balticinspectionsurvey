import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUsers, FiFileText, FiList, FiActivity } from "react-icons/fi";

const Container = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2d3436;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.2rem;
    color: #636e72;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  p {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3436;
  }
`;

const RecentActivity = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);

  h2 {
    font-size: 1.5rem;
    color: #2d3436;
    margin-bottom: 1.5rem;
  }
`;

const Dashboard = () => {
  const stats = [
    { icon: <FiUsers />, title: "Total Users", value: "1,234" },
    { icon: <FiFileText />, title: "Total Pages", value: "56" },
    { icon: <FiList />, title: "Menu Items", value: "23" },
    { icon: <FiActivity />, title: "Active Sessions", value: "89" },
  ];

  return (
    <Container>
      <Title>Dashboard Overview</Title>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3>
              {stat.icon} {stat.title}
            </h3>
            <p>{stat.value}</p>
          </StatCard>
        ))}
      </StatsGrid>

      <RecentActivity>
        <h2>Recent Activity</h2>
        {/* Add recent activity content here */}
      </RecentActivity>
    </Container>
  );
};

export default Dashboard;
