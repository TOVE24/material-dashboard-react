import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Grid,
  Card,
  Pagination,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useProductsTableData from "./data/productsTableData";

function Products() {
  const navigate = useNavigate();
  const {
    columns,
    rows, // Usamos rows directamente del hook
    loading,
    error,
    page,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    deleteDialog,
  } = useProductsTableData();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  // Función para navegar al formulario de creación
  const handleCreateNew = () => {
    navigate("/products/new");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <MDTypography variant="h6" color="white">
                      Lista de Productos
                    </MDTypography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleCreateNew}
                      startIcon={
                        <Icon
                          sx={{
                            color: "#fff", // Forzar color blanco
                            fontSize: "1.25rem", // Tamaño adecuado
                          }}
                        >
                          add
                        </Icon>
                      }
                      sx={{
                        color: "#fff",
                        backgroundColor: "#4CAF50",
                        "&:hover": {
                          backgroundColor: "#388E3C",
                        },
                        "& .MuiButton-startIcon": {
                          marginRight: "8px", // Espaciado adecuado
                        },
                      }}
                    >
                      Crear Nuevo
                    </Button>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                {loading && (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                )}
                {error && (
                  <MDBox px={2}>
                    <Alert severity="error">{error}</Alert>
                  </MDBox>
                )}
                {!loading && !error && (
                  <>
                    <DataTable
                      table={{ columns, rows }}
                      isSorted={false}
                      entriesPerPage={false}
                      showTotalEntries={true}
                      noEndBorder
                    />
                    <MDBox display="flex" justifyContent="center" p={2}>
                      <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                      />
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {deleteDialog}
      <Footer />
    </DashboardLayout>
  );
}

export default Products;
