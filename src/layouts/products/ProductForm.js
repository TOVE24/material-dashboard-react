import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Alert,
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
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing] = useState(!!id);

  // Estado inicial con valores por defecto seguros
  const initialFormState = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    cost: 0,
    stock: 0,
    isDigital: false,
    isActive: true,
    metadata: {
      color: "",
      sizes: [],
      material: "",
    },
  };

  const [formData, setFormData] = useState(initialFormState);

  // Cargar datos del producto desde location.state o sessionStorage
  useEffect(() => {
    if (id) {
      setLoading(true);

      // 1. Intenta obtener de location.state (navegación desde la tabla)
      const productFromState = location.state?.product;

      // 2. Si no está, intenta obtener de sessionStorage
      const productFromStorage = JSON.parse(sessionStorage.getItem(`product_${id}`));

      const product = productFromState || productFromStorage;

      const rawPrice =
        typeof product.price === "string"
          ? parseFloat(product.price.replace(/[^0-9.]/g, ""))
          : product.price;

      if (product) {
        setFormData({
          name: product.name || "",
          description: product.description || "",
          sku: product.sku || "",
          price: rawPrice || 0,
          cost: product.cost || 0,
          stock: product.stock || 0,
          isDigital: Boolean(product.isDigital),
          isActive: product.isActive !== false,
          metadata: {
            color: product.metadata?.color || "",
            tallas: Array.isArray(product.metadata?.tallas) ? product.metadata.tallas : [],
            material: product.metadata?.material || "",
          },
        });
      } else {
        setError(
          "No se encontraron los datos del producto. Por favor, regrese a la lista e intente nuevamente."
        );
      }

      setLoading(false);
    }
  }, [id, location.state]);

  // Manejador genérico de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value || 0) : value,
    }));
  };

  // Manejador para cambios en metadata
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

  // Manejador para cambios en sizes (array)
  const handleSizesChange = (e) => {
    const sizesArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        tallas: sizesArray,
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
        await api.patch(`/products/${id}`, formData);
        setSuccess("Producto actualizado correctamente");
      } else {
        await api.post("/products", formData);
        setSuccess("Producto creado correctamente");
        setFormData(initialFormState);
      }

      // Limpiar sessionStorage después de guardar
      if (isEditing) {
        sessionStorage.removeItem(`product_${id}`);
      }

      setTimeout(() => navigate("/products"), 2000);
    } catch (err) {
      console.error("Error al guardar:", err);
      setError(err.response?.data?.message || "Error al guardar el producto");

      // Guardar en sessionStorage para recuperación en caso de error
      if (isEditing) {
        sessionStorage.setItem(`product_${id}`, JSON.stringify(formData));
      }
    } finally {
      setLoading(false);
    }
  };

  const getSizesString = () => {
    // Verificamos la existencia de cada nivel del objeto
    if (formData.metadata && Array.isArray(formData.metadata.tallas)) {
      return formData.metadata.tallas.join(", ");
    }
    return ""; // Retorna string vacío si no hay tallas
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
                {loading ? (
                  <MDBox display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </MDBox>
                ) : (
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
                          type="text" // Cambiado a text para mejor control
                          value={formData.price} // Mostrar siempre con 2 decimales
                          onChange={(e) => {
                            // Convertir a número removendo caracteres no numéricos
                            const numericValue =
                              parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
                            setFormData((prev) => ({
                              ...prev,
                              price: numericValue,
                            }));
                          }}
                          required
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
                          value={getSizesString()}
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
                            variant=""
                            color="warning"
                            onClick={() => navigate("/products")}
                            disabled={loading}
                          >
                            Cancelar
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary" // Cambiado a primary (azul)
                            disabled={loading}
                            sx={{
                              backgroundColor: "#2196F3", // Azul
                              color: "white",
                              "&:hover": {
                                backgroundColor: "#1976D2", // Azul más oscuro al hover
                              },
                              "&:disabled": {
                                backgroundColor: "#BBDEFB", // Azul claro cuando está deshabilitado
                              },
                            }}
                          >
                            {loading ? (
                              <CircularProgress size={24} color="inherit" />
                            ) : id ? (
                              <MDTypography variant="h6" color="white">
                                Actualizar Producto
                              </MDTypography>
                            ) : (
                              <MDTypography variant="h6" color="white">
                                Crear Producto
                              </MDTypography>
                            )}
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </form>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ProductForm;
