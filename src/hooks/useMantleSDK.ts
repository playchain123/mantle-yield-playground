import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Protocol {
  id: string;
  name: string;
  type: string;
  tvl: number;
  apy: number;
  color: string;
}

interface Asset {
  name: string;
  symbol: string;
  balance: string;
  apr: string;
  value: string;
}

interface Position {
  protocol: string;
  protocolType: string;
  color: string;
  assets: Asset[];
}

interface UserPositions {
  positions: Position[];
  totalBalance: string;
  totalYield: string;
  protocolCount: number;
}

interface YieldHistoryEntry {
  date: string;
  [key: string]: string | number;
}

interface PerformanceEntry {
  date: string;
  value: number;
  earnings: number;
}

interface DistributionEntry {
  name: string;
  value: number;
  type: string;
}

interface Transaction {
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  chainId: number;
  type: string;
}

export const useMantleSDK = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callSDK = useCallback(async <T>(
    action: string, 
    params?: { wallet?: string; protocol?: string; asset?: string; amount?: string }
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({ action });
      if (params?.wallet) queryParams.append('wallet', params.wallet);

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mantle-sdk?${queryParams}`;
      
      const options: RequestInit = {
        method: params?.protocol || params?.asset ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      };

      if (params?.protocol || params?.asset) {
        options.body = JSON.stringify(params);
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`SDK call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('SDK Error:', message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const listSupportedProtocols = useCallback(async () => {
    const result = await callSDK<{ protocols: Protocol[] }>('listSupportedProtocols');
    return result?.protocols || [];
  }, [callSDK]);

  const getUserPositions = useCallback(async (walletAddress: string) => {
    const result = await callSDK<UserPositions>('getUserPositions', { wallet: walletAddress });
    return result;
  }, [callSDK]);

  const getYieldHistory = useCallback(async () => {
    const result = await callSDK<{ history: YieldHistoryEntry[] }>('getYieldHistory');
    return result?.history || [];
  }, [callSDK]);

  const getProtocolDistribution = useCallback(async () => {
    const result = await callSDK<{ distribution: DistributionEntry[] }>('getProtocolDistribution');
    return result?.distribution || [];
  }, [callSDK]);

  const getUserPerformanceHistory = useCallback(async (walletAddress: string) => {
    const result = await callSDK<{ history: PerformanceEntry[] }>('getUserPerformanceHistory', { wallet: walletAddress });
    return result?.history || [];
  }, [callSDK]);

  const buildDepositTx = useCallback(async (protocol: string, asset: string, amount: string) => {
    const result = await callSDK<{ transaction: Transaction }>('buildDepositTx', { protocol, asset, amount });
    return result?.transaction;
  }, [callSDK]);

  const buildWithdrawTx = useCallback(async (protocol: string, asset: string, amount: string) => {
    const result = await callSDK<{ transaction: Transaction }>('buildWithdrawTx', { protocol, asset, amount });
    return result?.transaction;
  }, [callSDK]);

  return {
    loading,
    error,
    listSupportedProtocols,
    getUserPositions,
    getYieldHistory,
    getProtocolDistribution,
    getUserPerformanceHistory,
    buildDepositTx,
    buildWithdrawTx,
  };
};
