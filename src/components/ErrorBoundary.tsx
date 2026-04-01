import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { hasError: boolean; message: string };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Something went wrong." };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            background: "#0f172a",
            color: "#e2e8f0",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "1rem", opacity: 0.9 }}>{this.state.message}</p>
          <p style={{ fontSize: "0.875rem", opacity: 0.75 }}>
            Open the browser developer console (F12 → Console) for the full stack trace. If you just added Supabase
            variables, restart the dev server (<code style={{ opacity: 0.9 }}>npm run dev</code>) so Vite picks up{" "}
            <code style={{ opacity: 0.9 }}>.env</code>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
