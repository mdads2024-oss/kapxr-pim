import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingService } from "@/services/billingService";
import { queryKeys } from "@/services/queryKeys";
import type { StartCheckoutInput } from "@/types/billing";

export const useBillingPlansQuery = () =>
  useQuery({
    queryKey: queryKeys.billingPlans(),
    queryFn: () => billingService.getPlans(),
  });

export const useBillingSubscriptionQuery = () =>
  useQuery({
    queryKey: queryKeys.billingSubscription(),
    queryFn: () => billingService.getWorkspaceSubscription(),
  });

export const useStartCheckoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartCheckoutInput) => billingService.startCheckout(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.billingSubscription() });
    },
  });
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => billingService.cancelSubscription(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.billingSubscription() });
    },
  });
};

export const useResumeSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => billingService.resumeSubscription(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.billingSubscription() });
    },
  });
};

export const useChangePlanMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: StartCheckoutInput) => billingService.changePlan(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.billingSubscription() });
    },
  });
};
