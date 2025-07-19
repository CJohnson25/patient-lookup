import {
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Link } from "react-router";
import mockPatientNotesData from "../data/mock_notes.json";
import mockPatientData from "../data/mock_patients.json";
import ViewContainer from "./containers/ViewContainer";
import { DownArrow } from "./icons/DownArrow";
import { RightArrow } from "./icons/RightArrow";
import PatientNote from "./PatientNote";
import { Note, NoteFilter, PatientData } from "./types";
import { formatDateTime, isWithinDateRange } from "./utils";

/**
 * PatientTable component displays a table of patients with filtering and sorting capabilities.
 */
export default function PatientTable() {
  // Assemble all patient data with their notes - in a real app, this would likely come from an API
  const allData: PatientData[] = mockPatientData
    ? mockPatientData.map((patient) => ({
        ...patient,
        notes: mockPatientNotesData.filter(
          (note) => note.patient_id === patient.id
        ),
      }))
    : [];

  const defaultNoteFilter: NoteFilter = {
    provider_name: [],
    hospital_name: [],
    start_date: undefined,
    end_date: undefined,
    text: "",
  };

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "notes", value: defaultNoteFilter },
  ]); // can set initial column filter state here
  const [data, _setData] = React.useState(() => [...allData]);

  // Column definitions
  const columnHelper = createColumnHelper<PatientData>();
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => "Name",
      cell: (info) => (
        <Link to={`/patient/${info.row.original.id}`}>{info.getValue()}</Link>
      ),
      filterFn: "includesString",
      sortingFn: "alphanumeric",
    }),
    columnHelper.accessor("gender", {
      id: "gender",
      header: () => "Gender",
      filterFn: "arrIncludesSome",
      sortingFn: "alphanumeric",
    }),
    columnHelper.accessor("date_of_birth", {
      id: "date_of_birth",
      header: "DoB",
      cell: (info) => formatDateTime(info.getValue() as string),
      filterFn: (row, columnId, value: [string, string]) => {
        const date = row.getValue(columnId)
          ? new Date(row.getValue(columnId) as string)
          : undefined;

        return isWithinDateRange(date, value);
      },
      sortingFn: "datetime",
    }),
    columnHelper.accessor("notes", {
      header: "Show Notes",
      cell: ({ row }) => {
        return row.getCanExpand() ? (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              row.getToggleExpandedHandler()();
            }}
          >
            {row.getIsExpanded() ? (
              <div>
                Hide notes
                <DownArrow />
              </div>
            ) : (
              <div>
                Show notes
                <RightArrow />
              </div>
            )}
          </a>
        ) : (
          ""
        );
      },
      filterFn: (row, columnId, value: NoteFilter) => {
        const notes = row.getValue(columnId) as Note[];
        return (
          notes &&
          notes.some(
            (note) => matchesNoteFilter(note, value) // Check if the note matches the filter criteria
          )
        );
      },
      enableSorting: false,
    }),
  ];

  // Table definition
  const table = useReactTable({
    data,
    columns,
    getRowCanExpand: (row) => {
      return (
        !!row.getValue("notes") &&
        !!(row.getValue("notes") as Note[])?.length &&
        (row.getValue("notes") as Note[])?.length > 0
      );
    }, // only allow expanding if there are notes
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  const nameCol = table.getColumn("name");
  const genderCol = table.getColumn("gender");
  const dobCol = table.getColumn("date_of_birth");
  const notesCol = table.getColumn("notes");

  // Function to check if a note matches the filter criteria
  function matchesNoteFilter(note: Note, filterValue: NoteFilter) {
    const matchesText =
      filterValue?.text && note.text
        ? note.text.toLowerCase().includes(filterValue.text.toLowerCase())
        : true;
    const matchesProvider =
      filterValue?.provider_name &&
      filterValue.provider_name.length &&
      note.provider_name
        ? filterValue.provider_name.some(
            (val) => note.provider_name?.toLowerCase() === val.toLowerCase()
          )
        : true;
    const matchesHospital =
      filterValue?.hospital_name &&
      filterValue.hospital_name.length &&
      note.hospital_name
        ? filterValue.hospital_name.some(
            (val) => note.hospital_name?.toLowerCase() === val.toLowerCase()
          )
        : true;
    const matchesDateRange =
      filterValue.start_date && filterValue.end_date
        ? isWithinDateRange(
            note.creation_date ? new Date(note.creation_date) : undefined,
            [filterValue.start_date, filterValue.end_date]
          )
        : true;

    return (
      matchesText && matchesProvider && matchesHospital && matchesDateRange
    );
  }

  return (
    <ViewContainer title="Patient Lookup">
      <div className="p-2">
        <div className="flex gap-4 mb-4 flex-no-wrap">
          <div className="flex gap-4 mb-4 flex-wrap">
            {/* Patient Name Filter */}
            <label>
              <div>
                <b>Name:</b>
              </div>
              <input
                type="text"
                placeholder="Filter by Name"
                className="border rounded p-1"
                value={(nameCol?.getFilterValue() as string) ?? ""}
                onChange={(e) => nameCol?.setFilterValue(e.target.value)}
              />
            </label>

            {/* Gender Filter */}
            <label>
              <div>
                <b>Gender:</b>
              </div>
              <select
                multiple
                value={(genderCol?.getFilterValue() as string[]) ?? []}
                onChange={(e) => {
                  const newVal = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );

                  genderCol?.setFilterValue(newVal);
                }}
              >
                {[...new Set(data.map((d) => d.gender))]
                  .filter(Boolean)
                  .map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
              </select>
            </label>
            {/* DoB Filter */}
            <label>
              <div>
                <b>DoB Between:</b>
              </div>
              <input
                type="date"
                placeholder="DoB Start Date"
                className="border rounded p-1 flex"
                value={
                  (dobCol?.getFilterValue() as [string, string])?.[0] ?? ""
                }
                onChange={(e) => {
                  dobCol?.setFilterValue([
                    e.target.value,
                    (dobCol.getFilterValue() as [string, string])?.[1] || "",
                  ]);
                }}
              />
              <input
                type="date"
                placeholder="DoB End Date"
                className="border rounded p-1"
                value={
                  (dobCol?.getFilterValue() as [string, string])?.[1] ?? ""
                }
                onChange={(e) => {
                  dobCol?.setFilterValue([
                    (dobCol.getFilterValue() as [string, string])?.[0] || "",
                    e.target.value,
                  ]);
                }}
              />
            </label>
            {/* Notes Provider Name Filter */}
            <label>
              <div>
                <b>Notes by Provider:</b>
              </div>
              <select
                multiple
                className="max-w-[150px]"
                value={
                  (notesCol?.getFilterValue() as NoteFilter)?.provider_name
                }
                onChange={(e) => {
                  const newVal = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );

                  notesCol?.setFilterValue({
                    ...(notesCol.getFilterValue() as NoteFilter),
                    provider_name: newVal,
                  });
                }}
              >
                {[
                  ...new Set(
                    data.flatMap((d) =>
                      d.notes ? d.notes.map((n) => n.provider_name) : []
                    )
                  ),
                ]
                  .filter(Boolean)
                  .map((provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  ))}
              </select>
            </label>
            {/* Notes Hospital Name Filter */}
            <label>
              <div>
                <b>Notes by Hospital:</b>
              </div>
              <select
                multiple
                value={(notesCol?.getFilterValue() as NoteFilter).hospital_name}
                className="max-w-[250px]"
                onChange={(e) => {
                  const newVal = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );

                  notesCol?.setFilterValue({
                    ...(notesCol.getFilterValue() as NoteFilter),
                    hospital_name: newVal,
                  });
                }}
              >
                {[
                  ...new Set(
                    data.flatMap(
                      (d) => d.notes && d.notes.map((n) => n.hospital_name)
                    )
                  ),
                ]
                  .filter(Boolean)
                  .map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
              </select>
            </label>
            {/* Notes Created At Filter */}
            <label>
              <div>
                <b>Notes Created Between:</b>
              </div>
              <input
                type="date"
                placeholder="Start Date"
                className="border rounded p-1 flex"
                value={
                  (notesCol?.getFilterValue() as NoteFilter)?.start_date ?? ""
                }
                onChange={(e) => {
                  notesCol?.setFilterValue({
                    ...(notesCol?.getFilterValue() as NoteFilter),
                    start_date: e.target.value,
                  });
                }}
              />
              <input
                type="date"
                placeholder="End Date"
                className="border rounded p-1"
                value={
                  (notesCol?.getFilterValue() as NoteFilter)?.end_date ?? ""
                }
                onChange={(e) => {
                  notesCol?.setFilterValue({
                    ...(notesCol?.getFilterValue() as NoteFilter),
                    end_date: e.target.value,
                  });
                }}
              />
            </label>
            {/* Notes Text Filter */}
            <label>
              <div>
                <b>Note content:</b>
              </div>
              <input
                type="text"
                placeholder="Filter by Note Text"
                className="border rounded p-1"
                value={(notesCol?.getFilterValue() as NoteFilter)?.text ?? ""}
                onChange={(e) =>
                  notesCol?.setFilterValue({
                    ...(notesCol.getFilterValue() as NoteFilter),
                    text: e.target.value,
                  })
                }
              />
            </label>
          </div>
          {/* Reset Filters Button */}
          <div>
            <button
              className="btn-primary"
              onClick={() => {
                setColumnFilters([]);
                nameCol?.setFilterValue("");
                genderCol?.setFilterValue([]);
                dobCol?.setFilterValue("");
                notesCol?.setFilterValue(defaultNoteFilter);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Patient Data Table */}
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === "asc"
                              ? "Sort ascending"
                              : header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ▲",
                          desc: " ▼",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <tr>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                    {/* If the row is expanded, render the expanded UI as a separate row with a single cell that spans the width of the table */}
                    {row.getIsExpanded() && (
                      <tr>
                        <td colSpan={row.getAllCells().length}>
                          <ul>
                            {(row.getValue("notes") as Note[])
                              .filter(
                                (note: Note) =>
                                  notesCol?.getFilterValue() &&
                                  matchesNoteFilter(
                                    note,
                                    notesCol?.getFilterValue() as NoteFilter
                                  )
                              )
                              .map((note: Note) => (
                                <li key={note.id}>
                                  <PatientNote note={note} />
                                </li>
                              ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data available. Please adjust your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="btn-primary"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="btn-primary"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="btn-primary"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="btn-primary"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div>{table.getRowModel().rows.length} Rows</div>
      </div>
    </ViewContainer>
  );
}
