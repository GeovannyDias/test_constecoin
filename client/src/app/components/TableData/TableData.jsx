import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { EnhancedTableHead } from "./components/EnhancedTableHead";
import { EnhancedTableToolbar } from "./components/EnhancedTableToolbar";
import { Spinner } from "../Spinner/Spinner";
import { Empty } from "../Empty/Empty";
import IconButton from "@mui/material/IconButton";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../../services";
import { ToastContainer } from "react-toastify";
import { getData } from "../../services/data.service";
// import styles from "./TableData.module.css";

// *************************************************************************************************
// FUNCTIONS
// *************************************************************************************************

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// COMPONENT FUNCTION
export function TableData() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Data
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const data_storage = JSON.parse(localStorage.getItem("data"));
    if (data_storage) {
      setData(data_storage);
      setIsLoading(false);
      console.log("Get Local Data");
    } else {
      getAllData();
    }
  }, []);

  // GET DATA
  async function getAllData() {
    await getData().then((data) => {
      setData(data);
      setIsLoading(false);

      if (data && data.length !== 0) {
        localStorage.setItem("data", JSON.stringify(data));
      } else {
        localStorage.removeItem("data");
      }
      console.log("Get Data Server");
    });
  }

  // ACTION BUTTONS

  function handleView(id) {
    console.log("handleView:", id);
    notifyInfo("handleView", "bottom-center");
  }

  function handleUpdate(data) {
    console.log("handleUpdate", data);
    notifySuccess("handleUpdate", "bottom-center");
  }

  async function handleDelete(id) {
    console.log("handleDelete:", id);
    notifyError("handleDelete", "bottom-center");
  }

  // Load data
  if (isLoading) return <Spinner />;
  if (!isLoading && data.length === 0) return <Empty />; // Si no hay resultados

  // Filters
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleAddClick = () => {
    notifyWarn("handleAddNew", "top-left");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar onAddClick={handleAddClick} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}

              {stableSort(data, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const labelId = `enhanced-table-checkbox-${index}`; // Remplazar con ID

                  return (
                    <TableRow hover key={row._id}>
                      <TableCell
                        component="th"
                        // id={labelId}
                        scope="row"
                      >
                        {row.ID}
                      </TableCell>

                      <TableCell align="left">{row.data}</TableCell>

                      <TableCell align="right">{row.rssi}</TableCell>

                      <TableCell align="right">Active</TableCell>

                      <TableCell align="right">
                        <IconButton onClick={() => handleView(row._id)}>
                          <VisibilityIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleUpdate(row)}>
                          <EditIcon color="success" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row._id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ToastContainer />
    </Box>
  );
}
