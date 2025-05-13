import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import api from "utils/api";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estado inicial con valores por defecto seguros
  const initialFormState = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    stock: 0,
    categories: [],
    isDigital: false,
    isActive: true,
    images: [],
    metadata: {
      color: "",
      sizes: [],
      material: "",
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  // Función segura para obtener tamaños
  const getSafeSizes = () => {
    return Array.isArray(formData.metadata?.sizes) ? formData.metadata.sizes.join(", ") : "";
  };

  // Cargar datos del producto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        if (id) {
          setIsEditing(true);
          setLoading(true);

          // 1. Intenta cargar desde la API
          const response = await api.get(`/products/${id}`);
          const product = response.data.data || {};

          // 2. Establecer datos con valores por defecto seguros
          setFormData({
            name: product.name || "",
            description: product.description || "",
            sku: product.sku || "",
            price: product.price || 0,
            cost: product.cost || 0,
            stock: product.stock || 0,
            categories: Array.isArray(product.categories) ? product.categories : [],
            isDigital: Boolean(product.isDigital),
            isActive: product.isActive !== false,
            images: Array.isArray(product.images) ? product.images : [],
            metadata: {
              color: product.metadata?.color || "",
              sizes: Array.isArray(product.metadata?.sizes) ? product.metadata.sizes : [],
            },
          });
        }
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar los datos del producto");
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [id]);

  // Manejadores de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value || 0) : value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value,
      },
    }));
  };

  // Manejador seguro para tamaños
  const handleSizesChange = (e) => {
    const sizesArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        sizes: sizesArray,
      },
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, formData);
        setSuccess("Producto actualizado correctamente");
      } else {
        await api.post("/products", formData);
        setSuccess("Producto creado correctamente");
        setFormData(initialFormState);
      }

      setTimeout(() => navigate("/products"), 2000);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.response?.data?.message || "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
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
                  {isEditing ? "Editar Producto" : "Crear Nuevo Producto"}
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Información Básica */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" gutterBottom>
                        Información Básica
                      </MDTypography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombre del Producto"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="SKU"
                        name="sku"
                        value={formData.sku}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Descripción"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Precios e Inventario */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" gutterBottom>
                        Precios e Inventario
                      </MDTypography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Precio de Venta"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        inputProps={{ step: "0.01", min: "0" }}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Costo"
                        name="cost"
                        type="number"
                        value={formData.cost}
                        onChange={handleChange}
                        inputProps={{ step: "0.01", min: "0" }}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Stock Disponible"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                        inputProps={{ min: "0" }}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Metadatos */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" gutterBottom>
                        Detalles Adicionales
                      </MDTypography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Color"
                        name="color"
                        value={formData.metadata.color}
                        onChange={handleMetadataChange}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Tallas (separadas por comas)"
                        value={getSafeSizes()}
                        onChange={handleSizesChange}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Material"
                        name="material"
                        value={formData.metadata.material}
                        onChange={handleMetadataChange}
                        disabled={loading}
                      />
                    </Grid>

                    {/* Opciones */}
                    <Grid item xs={12}>
                      <MDTypography variant="h6" gutterBottom>
                        Opciones
                      </MDTypography>
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.isDigital}
                            onChange={handleChange}
                            name="isDigital"
                            color="primary"
                            disabled={loading}
                          />
                        }
                        label="Producto digital (no físico)"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.isActive}
                            onChange={handleChange}
                            name="isActive"
                            color="primary"
                            disabled={loading}
                          />
                        }
                        label="Producto activo"
                      />
                    </Grid>

                    {/* Botones */}
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => navigate("/products")}
                          disabled={loading}
                        >
                          Cancelar
                        </Button>
                        <Button type="submit" variant="contained" color="info" disabled={loading}>
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : isEditing ? (
                            "Actualizar Producto"
                          ) : (
                            "Crear Producto"
                          )}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

ProductForm.propTypes = {
  // Agrega PropTypes si este componente recibe props
};

export default ProductForm;
