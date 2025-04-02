export default function Loader({ loading }) {
    if (!loading) return null
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </div>
      </div>
    )
  }