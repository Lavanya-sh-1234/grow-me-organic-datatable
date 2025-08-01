import { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";

// Defined data structure for table entries
interface TableData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

function DataTableComponent() {
  const [data, setData] = useState<TableData[]>([]); // State to hold fetched data

  const [loading, setLoading] = useState<boolean>(true); // State to control loading indicator

  const [first, setFirst] = useState(0); // index of the first row for pagination

  const [rows, setRows] = useState<number>(6); // rows per page

  const [rowsNumber, setRowsNumber] = useState<number>(0); // for input field in overlay panel which tells how many rows to fetch

  const [totalRecords, setTotalRecords] = useState<number>(0); // total records for pagination

  const [selectedRows, setSelectedRows] = useState<TableData[]>([]); // selected rows in the table

  const op = useRef<OverlayPanel>(null); // reference to the OverlayPanel

  // Fetch new data whenever page index or page size changes
  useEffect(() => {
    const page = first / rows + 1;
    fetchPageData(page);
  }, [first, rows]);

  // Fetch data from API for the user's current page
  const fetchPageData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rows}`
      );
      const json = await response.json();
      setData(json.data);
      setTotalRecords(json.pagination.total); // Set total records for paginator
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch page data", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination changes
  // This function updates the first index and number of rows displayed
  const onPage = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  //when user submits number, this function fetch that many rows and set them as selected
  const submitSelectedRows = async () => {
    setLoading(true);
    if (rowsNumber > 0) {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${1}&limit=${rowsNumber}`
      );
      const json = await response.json();
      setSelectedRows(json.data);
      setLoading(false);
    } else {
      console.warn("Please enter a valid number of rows.");
    }
  };

  return (
    <div>
      {/* OverlayPanel tp allow users to input the number of rows to select and fetch */}
      <OverlayPanel ref={op} showCloseIcon>
        <InputNumber
          value={rowsNumber}
          onValueChange={(e) => setRowsNumber(e.value || 0)}
          showButtons
          min={1}
          max={100}
          placeholder="Rows per page"
        />

        <div style={{ marginTop: "1rem" }}>
          <Button onClick={submitSelectedRows}>Submit</Button>
        </div>
      </OverlayPanel>

      {loading && (
        <div
          style={{ textAlign: "center", marginBottom: "1rem", color: "#666" }}
        >
          Fetching data from API...
        </div>
      )}

      {/* Table container and icon button */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          onClick={(e) => op.current?.toggle(e)}
          style={{
            position: "absolute",
            top: "24px",
            left: "42px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "2px",
            margin: "0 8px 4px 1px",
            zIndex: 4,
          }}
        >
          <i
            className="pi pi-chevron-down"
            style={{ fontSize: "1rem", color: "#555" }}
          />
        </button>

        {/* DataTable with pagination, selection, and lazy loading */}
        <DataTable
          value={data}
          paginator
          lazy
          loading={loading}
          first={first}
          rows={rows}
          totalRecords={totalRecords}
          onPage={onPage}
          rowsPerPageOptions={[6, 12, 24]}
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={(e: { value: TableData[] }) => {
            setSelectedRows(e.value);
          }}
          dataKey="id"
          tableStyle={{ minWidth: "50rem" }}
        >
          {/* Column for multi-select checkboxes */}
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

          {/* Data columns */}
          <Column field="title" header="Title" />
          <Column field="place_of_origin" header="Place of Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptions" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      </div>
    </div>
  );
}

export default DataTableComponent;
