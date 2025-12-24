import { useState, useCallback } from "react";

interface Protocol {
  id: string;
  name: string;
  type: string;
  tvl: number;
  apy: number;
  color: string;
  description?: string;
  contractAddress?: string;
  risks?: string[];
  features?: string[];
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

interface PoolYield {
  protocolId: string;
  protocolName: string;
  poolName: string;
  assetSymbol: string;
  assetAddress: string;
  apr: number;
  underlying: string;
  riskLevel: string;
  tvl?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export const useMantleSDK = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const callSDK = useCallback(async <T>(
    action: string, 
    params?: { wallet?: string; protocol?: string; asset?: string; amount?: string },
    attempt = 1
  ): Promise<T | null> => {
    if (attempt === 1) {
      setLoading(true);
      setError(null);
      setRetryCount(0);
    }

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
      
      // Handle 5xx errors (backend waking up)
      if (response.status >= 500 && attempt < MAX_RETRIES) {
        console.log(`[SDK] Backend unavailable, retrying in ${RETRY_DELAY}ms (attempt ${attempt}/${MAX_RETRIES})`);
        setRetrying(true);
        setRetryCount(attempt);
        await sleep(RETRY_DELAY);
        return callSDK<T>(action, params, attempt + 1);
      }
      
      if (!response.ok) {
        throw new Error(`SDK call failed: ${response.statusText}`);
      }

      const data = await response.json();
      setRetrying(false);
      return data as T;
    } catch (err) {
      // Retry on network errors
      if (attempt < MAX_RETRIES) {
        console.log(`[SDK] Network error, retrying in ${RETRY_DELAY}ms (attempt ${attempt}/${MAX_RETRIES})`);
        setRetrying(true);
        setRetryCount(attempt);
        await sleep(RETRY_DELAY);
        return callSDK<T>(action, params, attempt + 1);
      }
      
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setRetrying(false);
      console.error('SDK Error:', message);
      return null;
    } finally {
      if (attempt >= MAX_RETRIES || !retrying) {
        setLoading(false);
      }
    }
  }, []);

  const listSupportedProtocols = useCallback(async () => {
    const result = await callSDK<{ protocols: Protocol[] }>('listSupportedProtocols');
    return result?.protocols || [];
  }, [callSDK]);

  const getProtocolDetails = useCallback(async (protocolId: string) => {
    const result = await callSDK<{ protocol: Protocol; yields: PoolYield[] }>('getProtocolDetails', { protocol: protocolId });
    return result;
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

  const getPoolYields = useCallback(async () => {
    const result = await callSDK<{ yields: PoolYield[] }>('getPoolYields');
    return result?.yields || [];
  }, [callSDK]);

  const buildDepositTx = useCallback(async (protocol: string, asset: string, amount: string) => {
    const result = await callSDK<{ transaction: Transaction }>('buildDepositTx', { protocol, asset, amount });
    return result?.transaction;
  }, [callSDK]);

  const buildWithdrawTx = useCallback(async (protocol: string, asset: string, amount: string) => {
    const result = await callSDK<{ transaction: Transaction }>('buildWithdrawTx', { protocol, asset, amount });
    return result?.transaction;
  }, [callSDK]);

  const getBlockNumber = useCallback(async () => {
    const result = await callSDK<{ blockNumber: string }>('getBlockNumber');
    return result?.blockNumber;
  }, [callSDK]);

  return {
    loading,
    error,
    retrying,
    retryCount,
    listSupportedProtocols,
    getProtocolDetails,
    getUserPositions,
    getYieldHistory,
    getProtocolDistribution,
    getUserPerformanceHistory,
    getPoolYields,
    buildDepositTx,
    buildWithdrawTx,
    getBlockNumber,
  };
};
