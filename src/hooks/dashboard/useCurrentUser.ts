"use client";
import { useQuery } from '@tanstack/react-query';
import { currentUser } from '@/app/api/user/currentUser';
import { unwrapFetchResult } from '@/lib/react-query/fetchResult';
import { queryKeys } from '@/lib/react-query/queryKeys';
import { DASHBOARD_STALE_TIME_MS } from '@/lib/react-query/queryClient';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => unwrapFetchResult(currentUser()),
    staleTime: DASHBOARD_STALE_TIME_MS,
  });
};
