import { Globe } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/40 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">VoyageAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered virtual travel. Explore the world from anywhere.
            </p>
          </div>

          {[
            { title: "Product", links: [["Explore", "/explore"], ["Pricing", "/pricing"], ["Dashboard", "/dashboard"]] },
            { title: "Company", links: [["About", "#"], ["Blog", "#"], ["Careers", "#"]] },
            { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Cookies", "#"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VoyageAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
