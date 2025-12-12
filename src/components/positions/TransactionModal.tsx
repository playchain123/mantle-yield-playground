import { useState } from "react";
import { X, Copy, Check, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
  protocol: string;
  asset: string;
}

const TransactionModal = ({ isOpen, onClose, type, protocol, asset }: TransactionModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const txData = {
    to: "0x1234567890abcdef1234567890abcdef12345678",
    data: `0x${type === "deposit" ? "a9059cbb" : "2e1a7d4d"}000000000000000000000000...`,
    value: type === "deposit" ? "1000000000000000000" : "0",
    gasLimit: "250000",
    chainId: 5000,
    from: "0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7"
  };

  const jsonString = JSON.stringify(txData, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 glow-primary animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Code2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Generated Transaction Data
              </h2>
              <p className="text-sm text-muted-foreground">
                {type === "deposit" ? "Deposit" : "Withdraw"} • {protocol} • {asset}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <pre className="p-4 rounded-xl bg-background border border-border overflow-x-auto text-sm font-mono text-foreground">
            {jsonString}
          </pre>
          
          <Button
            variant="glass"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "absolute top-3 right-3 transition-all",
              copied && "bg-primary/20 text-primary border-primary/30"
            )}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy JSON
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          For demo purposes only. Not sent on-chain.
        </p>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
