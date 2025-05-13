import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CodePage() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        navigate(`/share/${id}`);
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-vh-100 bg-dark d-flex flex-column justify-content-center align-items-center bg-light">
      <div className="card shadow-lg p-4 p-md-5" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <h1 className="h2 fw-bold text-dark">Share Your Code</h1>
          <p className="text-muted">Enter a unique identifier to create or access a shared code space</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="codeId" className="form-label fw-medium">Session ID</label>
            <input
              id="codeId"
              className="form-control form-control-lg"
              onChange={(e) => setId(e.target.value)}
              type="text"
              value={id}
              placeholder="e.g. my-awesome-project"
              required
            />
            <div className="form-text">This will create a new shareable link</div>
          </div>
          
          <button
            className={`btn btn-dark btn-lg w-100 ${isLoading ? 'disabled' : ''}`}
            type="submit"
            disabled={!id.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              'Create Session'
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-muted mb-2">Or try one of these examples:</p>
          <div className="d-flex gap-2 justify-content-center">
            <button 
              onClick={() => setId('react-demo')} 
              className="btn mx-2 btn-sm btn-outline-secondary"
            >
              react-demo
            </button>
            <button 
              onClick={() => setId('todo-app')} 
              className="btn mx-2 btn-sm btn-outline-secondary"
            >
              todo-app
            </button>
            <button 
              onClick={() => setId('weather-api')} 
              className="btn mx-2 btn-sm btn-outline-secondary"
            >
              weather-api
            </button>
          </div>
        </div>
      </div>
      
      <footer className="mt-5 text-center text-muted small">
        <p>Code sharing made simple • Works across devices</p>
      </footer>
    </div>
  );
}