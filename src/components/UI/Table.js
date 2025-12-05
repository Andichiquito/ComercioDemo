import React, { useState } from 'react';
import { FaChartBar, FaSearch } from 'react-icons/fa';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  className = '',
  ...props
}) => {
  if (loading) {
    return (
      <div className={`glass-card p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/20 rounded w-1/4"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 bg-white/20 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`glass-card p-8 text-center ${className}`}>
        <div className="text-4xl mb-4"><FaChartBar /></div>
        <p className="text-white/70">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`glass-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full" {...props}>
          <thead>
            <tr className="border-b border-white/20">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, rowIndex) => {
              if (!row) return null; // Skip undefined rows
              return (
                <tr
                  key={rowIndex}
                  className="hover:bg-white/5 transition-colors duration-200"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-white/90"
                    >
                      {column.render ? column.render(row, rowIndex) : (row[column.key] || '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  searchable = false,
  searchPlaceholder = 'Buscar...',
  onSearch,
  className = '',
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = searchable && searchTerm
    ? data.filter(row => 
        row && columns.some(column =>
          String(row[column.key] || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data.filter(row => row); // Filter out undefined rows

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {searchable && (
        <div className="glass-card p-4">
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50">
              <FaSearch />
            </div>
          </div>
        </div>
      )}
      
      <Table
        data={filteredData}
        columns={columns}
        loading={loading}
        emptyMessage={emptyMessage}
        {...props}
      />
    </div>
  );
};

export const PaginatedTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalItems,
  className = '',
  ...props
}) => {
  const totalPages = Math.ceil((totalItems || data.length) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.filter(row => row).slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Table
        data={paginatedData}
        columns={columns}
        loading={loading}
        emptyMessage={emptyMessage}
        {...props}
      />
      
      {totalPages > 1 && (
        <div className="glass-card p-4">
          <div className="flex items-center justify-between">
            <div className="text-white/70 text-sm">
              Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems || data.length)} de {totalItems || data.length} resultados
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                ←
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
