import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-extrabold text-ink-900 mb-2">Une erreur est survenue</h1>
          <p className="text-ink-800/60 mb-6 max-w-md">
            Un problème inattendu s'est produit. Veuillez actualiser la page ou revenir à l'accueil.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Actualiser
            </button>
            <Link to="/" className="btn-ghost" onClick={() => this.setState({ hasError: false })}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
