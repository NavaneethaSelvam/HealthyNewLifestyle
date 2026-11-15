export function RouteLoading({ label = "Loading storefront…" }: { label?: string }) {
  return (
    <main className="hnl-page">
      <div className="hnl-container hnl-route-loading" role="status">
        <span className="hnl-route-loading-mark" aria-hidden="true" />
        {label}
      </div>
    </main>
  );
}
