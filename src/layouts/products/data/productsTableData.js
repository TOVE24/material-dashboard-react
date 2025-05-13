import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "utils/api";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

// Definición de PropTypes para la celda
const CellWithActions = ({ row }) => {
  const navigate = useNavigate();

  const handleEdit = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleView = (productId) => {
    navigate(`/products/view/${productId}`);
  };

  return (
    <MDBox display="flex" justifyContent="center" gap={1}>
      <Tooltip title="Editar">
        <IconButton color="info" size="small" onClick={() => handleEdit(row.original._id)}>
          <Icon>edit</Icon>
        </IconButton>
      </Tooltip>
      <Tooltip title="Ver detalles">
        <IconButton color="dark" size="small" onClick={() => handleView(row.original._id)}>
          <Icon>visibility</Icon>
        </IconButton>
      </Tooltip>
    </MDBox>
  );
};

// Validación de PropTypes para CellWithActions
CellWithActions.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default function useProductsTableData() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Configuración de columnas
  const columns = [
    { Header: "Nombre", accessor: "name", width: "25%" },
    { Header: "SKU", accessor: "sku", width: "15%" },
    { Header: "Precio", accessor: "price", width: "10%" },
    { Header: "Stock", accessor: "stock", width: "10%" },
    { Header: "Estado", accessor: "status", width: "10%" },
    {
      Header: "Acciones",
      accessor: "actions",
      width: "15%",
      Cell: CellWithActions,
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

  // Preparar filas
  const rows = products.map((product) => ({
    ...product,
    price: `$${product.price.toFixed(2)}`,
    status: (
      <MDBadge
        badgeContent={product.isActive ? "Activo" : "Inactivo"}
        color={product.isActive ? "success" : "error"}
        variant="gradient"
        size="sm"
      />
    ),
  }));

  return {
    columns,
    rows,
    loading,
    error,
    page,
    totalPages,
    setPage,
  };
}
