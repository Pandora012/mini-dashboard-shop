import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-center text-white">
          <div>
            <p className="text-lg font-semibold">Halaman tidak dapat dimuat.</p>
            <button
              className="mt-4 rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950"
              onClick={() => window.location.reload()}
            >
              Muat ulang halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
