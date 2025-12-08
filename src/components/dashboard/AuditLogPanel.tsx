import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock } from "lucide-react";
import { AuditLogEntry } from "@/types/medical";
import { format } from "date-fns";

interface AuditLogPanelProps {
  entries: AuditLogEntry[];
  onExport: () => void;
}

export function AuditLogPanel({ entries, onExport }: AuditLogPanelProps) {
  const getActionColor = (action: string) => {
    switch (action) {
      case 'query':
        return 'bg-medical-primary/20 text-medical-primary border-medical-primary/30';
      case 'retrieval':
        return 'bg-medical-accent/20 text-medical-accent border-medical-accent/30';
      case 'access':
        return 'bg-medical-secondary/20 text-medical-secondary border-medical-secondary/30';
      case 'login':
      case 'logout':
        return 'bg-medical-warning/20 text-medical-warning border-medical-warning/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50 h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <FileText className="h-4 w-4 text-medical-primary" />
          Audit Log
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="h-7 text-xs"
          disabled={entries.length === 0}
        >
          <Download className="h-3 w-3 mr-1" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] px-4 pb-4">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <Clock className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No audit entries yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.slice().reverse().map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-2 p-2 rounded-md bg-background/50 border border-border/30"
                >
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${getActionColor(entry.action)}`}
                  >
                    {entry.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">
                      {entry.dataAccessed}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {entry.userId} • {format(entry.timestamp, 'HH:mm:ss')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
