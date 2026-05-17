import React, { ReactNode } from "react";

// Props for Table
interface TableProps {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan?: number;
}

export const tableWrapperClasses =
  "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]";
export const tableHeaderClasses =
  "border-b border-gray-200 dark:border-white/[0.05] bg-gray-100 dark:bg-white/[0.03]";
export const tableHeaderCellClasses =
  "px-5 py-3 font-medium text-gray-600 text-start text-theme-xs dark:text-gray-400";
export const tableBodyClasses =
  "divide-y divide-gray-100 dark:divide-white/[0.05]";
export const tableRowNormalClasses = "bg-white dark:bg-white/[0.03]";
export const tableRowAlternateClasses = "bg-gray-100 dark:bg-white/[0.05]";
export const tableCellClasses =
  "px-4 py-2 sm:px-5 text-start font-normal text-gray-900 text-theme-xs dark:text-white/90";
export const tableActionCellButtonWrapperClasses =
  "flex items-center justify-end gap-1";
export const tableActionBtnCommonClasses =
  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2 transition rounded-md px-1.5 py-1.5 text-lg font-medium duration-200 w-8 h-8 ring-1 ring-inset focus:outline-none";
export const tableActionPrimaryButtonClasses = `${tableActionBtnCommonClasses} text-brand-600 bg-brand-100 hover:bg-brand-700 hover:text-brand-50 ring-brand-200 hover:ring-brand-700 shadow-theme-xs disabled:bg-blue-300`;
export const tableActionSecondaryButtonClasses = `${tableActionBtnCommonClasses} text-orange-600 bg-orange-100 hover:bg-orange-700 hover:text-orange-50 ring-orange-200 hover:ring-orange-700 shadow-theme-xs disabled:bg-orange-300`;
export const tableActionInfoButtonClasses = `${tableActionBtnCommonClasses} text-blue-light-600 bg-blue-light-100 hover:bg-blue-light-700 hover:text-blue-light-50 ring-blue-light-200 hover:ring-blue-light-700 shadow-theme-xs disabled:bg-blue-light-300`;
export const tableActionWarningButtonClasses = `${tableActionBtnCommonClasses} text-warning-600 bg-warning-100 hover:bg-warning-700 hover:text-warning-50 ring-warning-200 hover:ring-warning-700 shadow-theme-xs disabled:bg-warning-300`;
export const tableActionDangerButtonClasses = `${tableActionBtnCommonClasses} text-error-600 bg-error-100 hover:bg-error-700 hover:text-error-50 ring-error-200 hover:ring-error-700 shadow-theme-xs disabled:bg-error-300`;
export const previewActionBtnCommonClasses =
  "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2 transition rounded-md px-1.5 py-1.5 text-lg font-medium duration-200 w-auto h-auto ring-1 ring-inset focus:outline-none";
export const previewbutton = `${previewActionBtnCommonClasses} text-orange-600 bg-orange-100 hover:bg-orange-700 hover:text-orange-50 ring-orange-200 hover:ring-orange-700 shadow-theme-xs disabled:bg-orange-300`;
export const submitButton = `${previewActionBtnCommonClasses} text-blue-600 bg-blue-100 hover:bg-blue-700 hover:text-blue-50 ring-blue-200 hover:ring-blue-700 shadow-theme-xs disabled:bg-blue-300`;
// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
  return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  className,
  colSpan,
}) => {
  const CellTag = isHeader ? "th" : "td";
  return (
    <CellTag className={` ${className}`} colSpan={colSpan}>
      {children}
    </CellTag>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
