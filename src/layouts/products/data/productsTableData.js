import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "utils/api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ConfirmationDialog from "components/MDDialog/index"; // Asegúrate de importar el componente de diálogo

export default function useProductsTableData() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
  });

  // Función para manejar la edición con el producto completo
  const handleEdit = (product) => {
    // Guardar el producto completo en sessionStorage
    sessionStorage.setItem(`product_${product._id}`, JSON.stringify(product));
    // Navegar a la página de edición con el estado
    navigate(`/products/edit/${product._id}`, { state: { product } });
  };

  const handleDeleteClick = (productId) => {
    setDeleteDialog({
      open: true,
      productId,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/products/${deleteDialog.productId}`);
      setProducts(products.filter((p) => p._id !== deleteDialog.productId));
      // Opcional: Mostrar notificación de éxito
    } catch (error) {
      console.error("Error al eliminar:", error);
      // Opcional: Mostrar notificación de error
    } finally {
      setDeleteDialog({ open: false, productId: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, productId: null });
  };

  const actionButtonStyles = {
    edit: {
      color: "#2196F3",
      "&:hover": {
        backgroundColor: "rgba(33, 150, 243, 0.08)",
      },
    },
    delete: {
      color: "#F44336",
      "&:hover": {
        backgroundColor: "rgba(244, 67, 54, 0.08)",
      },
    },
  };
  // Configuración de columnas
  const columns = [
    { Header: "Nombre", accessor: "name", width: "25%" },
    { Header: "SKU", accessor: "sku", width: "15%" },
    { Header: "Precio", accessor: "price", width: "10%" },
    { Header: "Stock", accessor: "stock", width: "10%" },
    {
      Header: "Estado",
      accessor: "isActive",
      Cell: (value) => (
        <MDBadge
          badgeContent={value ? "Activo" : "Inactivo"}
          color={value ? "success" : "error"}
          variant="gradient"
          size="sm"
        />
      ),
      width: "10%",
    },
    {
      Header: "Acciones",
      accessor: "actions",
      width: "15%",
      Cell: (row) => {
        // Acceder al producto completo desde row.original
        const product = row.row.original;
        return (
          <MDBox display="flex" justifyContent="center" gap={1}>
            <Tooltip title="Editar">
              <IconButton color="info" size="small" onClick={() => handleEdit(product)}>
                <Icon>edit</Icon>
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                sx={actionButtonStyles.delete}
                size="small"
                onClick={() => handleDeleteClick(row.row.original._id)}
              >
                <Icon fontSize="small">delete</Icon>
              </IconButton>
            </Tooltip>
          </MDBox>
        );
      },
    },
  ];

  // Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products?page=${page}`);
        setProducts(response.data.data);
        setTotalPages(Math.ceil(response.data.results / 10));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  // Preparar filas con los datos necesarios
  const rows = products.map((product) => ({
    ...product,
    price: `$${product.price.toFixed(2)}`,
    // Asegúrate de incluir todos los campos que necesites en las columnas
    _id: product._id, // Asegúrate de incluir el _id
    isActive: product.isActive, // Asegúrate de incluir isActive
  }));

  return {
    columns,
    rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
    deleteDialog: (
      <ConfirmationDialog
        open={deleteDialog.open}
        title="Eliminar Producto"
        message="¿Estás seguro de eliminar este producto? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    ),
  };
}
