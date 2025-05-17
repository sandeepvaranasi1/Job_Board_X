import { Box } from "@mui/material";
import { useAuth } from "./hooks/useAuth";

import AppRoutes from "./routes/AppRoutes";

import Layout from "./components/Layout";

const App = () => {
  const { loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <Layout>
      <Box>
        <AppRoutes />
      </Box>
    </Layout>
  );
};

export default App;
