import { useState } from "react";
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
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import useProductsTableData from "./data/productsTableData";

function Products() {
  const {
    columns,
    rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
  } = useProductsTableData();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
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
                <MDTypography variant="h6" color="white">
                  Lista de Productos
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Buscar por nombre o SKU"
                      variant="outlined"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        label="Categoría"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        <MenuItem value="electronics">Electrónicos</MenuItem>
                        <MenuItem value="clothing">Ropa</MenuItem>
                        <MenuItem value="home">Hogar</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button variant="contained" color="info" fullWidth onClick={handleResetFilters}>
                      Limpiar Filtros
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
      <Footer />
    </DashboardLayout>
  );
}

export default Products;
