import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, DollarSign, Loader2, AlertTriangle } from "lucide-react";
import { getAIGuide, type AIGuideResponse } from "@/lib/webhooks";

export default function AIGuideModal({ placeId, placeName }: { placeId: string; placeName: string }) {
  const [guide, setGuide] = useState<AIGuideResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock] = useState(false);

  const handleOpen = async (open: boolean) => {
    if (open && !guide) {
      setLoading(true);
      const result = await getAIGuide(placeId, placeName);
      setGuide(result.data);
      setIsMock(result.isMock);
      setLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-hero-gradient text-primary-foreground gap-2 hover:opacity-90">
          <Sparkles className="w-4 h-4" /> Explain this place
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> AI Guide — {placeName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : guide ? (
          <div className="space-y-4">
            {isMock && (
              <div className="flex items-center gap-2 text-xs text-sunset bg-sunset/10 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4" />
                Showing sample data — n8n webhook unavailable
              </div>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{guide.explanation}</p>

            <div>
              <h4 className="text-sm font-semibold mb-2">Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {guide.highlights.map((h) => (
                  <span key={h} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">{h}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-ocean" />
                <div>
                  <div className="text-xs text-muted-foreground">Best time</div>
                  <div className="font-medium">{guide.bestTime}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs text-muted-foreground">Daily budget</div>
                  <div className="font-medium">{guide.budget}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
