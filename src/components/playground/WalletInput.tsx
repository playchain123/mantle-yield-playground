import { useState } from "react";
import { Wallet, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalletInputProps {
  onLoadPositions: (address: string) => void;
  isLoading: boolean;
}

const DEMO_ADDRESS = "0x742d35Cc6634C0532925a3b844Bc9e7595f8bDe7";

const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const WalletInput = ({ onLoadPositions, isLoading }: WalletInputProps) => {
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = isValidAddress(address);
  const showError = touched && address.length > 0 && !isValid;
  const showSuccess = address.length > 0 && isValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onLoadPositions(address);
    }
  };

  const handleUseExample = () => {
    setAddress(DEMO_ADDRESS);
    setTouched(true);
  };

  return (
    <div className="rounded-2xl p-6 sm:p-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label 
            htmlFor="wallet-address" 
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <Wallet className="h-4 w-4" />
            Wallet Address
          </label>
          
          <div className="relative">
            <input
              id="wallet-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="0x..."
              className={cn(
                "w-full h-14 px-4 pr-12 rounded-xl bg-background border-2 transition-all duration-200",
                "text-foreground placeholder:text-muted-foreground/50",
                "font-mono text-sm sm:text-base",
                "focus:outline-none focus:ring-0",
                showError 
                  ? "border-destructive focus:border-destructive" 
                  : showSuccess 
                    ? "border-primary/50 focus:border-primary" 
                    : "border-border focus:border-primary/50"
              )}
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {showError && <AlertCircle className="h-5 w-5 text-destructive" />}
              {showSuccess && <CheckCircle2 className="h-5 w-5 text-primary" />}
            </div>
          </div>

          {showError && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Please enter a valid EVM address
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="glass"
            onClick={handleUseExample}
            className="flex-1"
          >
            Use Example Address
          </Button>
          
          <Button
            type="submit"
            variant="glow"
            disabled={!isValid || isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load Positions"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WalletInput;
