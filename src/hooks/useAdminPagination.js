import { useState } from "react";

/**
 * Shared pagination state for the admin tables. Clamps the current page to a
 * valid range whenever the dataset shrinks (refresh / delete), and resets to
 * page 1 when the user changes the rows-per-page setting.
 */
export const useAdminPagination = (rows, defaultPerPage = 10) => {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(defaultPerPage);

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
    const currentPage = Math.min(page, totalPages);

    const start = (currentPage - 1) * rowsPerPage;
    const paginatedRows = rows.slice(start, start + rowsPerPage);

    const handleRowsPerPage = (value) => {
        setRowsPerPage(Number(value) || defaultPerPage);
        setPage(1);
    };

    return {
        page: currentPage,
        setPage,
        rowsPerPage,
        setRowsPerPage: handleRowsPerPage,
        total,
        totalPages,
        paginatedRows,
        start,
        end: start + paginatedRows.length,
    };
};

export default useAdminPagination;
