function ListToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filter",
  sortValue,
  onSortChange,
  sortOptions,
  count,
  countLabel = "total",
  children,
}) {
  return (
    <div className="list-toolbar card shadow-sm mb-3">
      <div className="card-body py-3">
        <div className="row g-2 align-items-center">
          <div className="col-md-4">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          {filterOptions && (
            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
              >
                <option value="">{filterLabel}: All</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}
          {sortOptions && (
            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
              >
                {sortOptions.map(({ value, label }) => (
                  <option key={value} value={value}>
                    Sort: {label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-md-auto ms-md-auto d-flex align-items-center gap-2">
            {count != null && (
              <span className="badge bg-secondary">
                {count} {countLabel}
              </span>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListToolbar;
