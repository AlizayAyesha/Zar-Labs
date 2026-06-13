export function AdminCmsEditorShell({ title, description, publicRoute, children, actions }) {
  return (
    <div className="admin-cms-shell">
      <header className="dashboard-header">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
          {publicRoute ? (
            <p className="admin-cms-public-link">
              Public:{" "}
              <a href={publicRoute} target="_blank" rel="noopener noreferrer">
                {publicRoute} ↗
              </a>
            </p>
          ) : null}
        </div>
        {actions ? <div className="dashboard-actions">{actions}</div> : null}
      </header>
      {children}
    </div>
  );
}
