import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pimService } from "@/services/pimService";
import { queryKeys } from "@/services/queryKeys";
import type {
  Asset,
  Attribute,
  Brand,
  Category,
  ImportExportHistoryItem,
  Integration,
  Product,
  TeamMember,
} from "@/types/pim";
import type { PimEntityId } from "@/types/pim";

export const useProductsQuery = () =>
  useQuery({
    queryKey: queryKeys.products(),
    queryFn: () => pimService.getProducts(),
  });

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => pimService.getCategories(),
  });

export const useBrandsQuery = () =>
  useQuery({
    queryKey: queryKeys.brands(),
    queryFn: () => pimService.getBrands(),
  });

export const useBrandQuery = (id: PimEntityId) =>
  useQuery({
    queryKey: [...queryKeys.brands(), id] as const,
    queryFn: () => pimService.getBrandById(id),
    enabled: Boolean(id),
  });

export const useProductQuery = (id: PimEntityId) =>
  useQuery({
    queryKey: [...queryKeys.products(), id],
    queryFn: () => pimService.getProductById(id),
    enabled: Boolean(id),
  });

export const useAssetsQuery = () =>
  useQuery({
    queryKey: queryKeys.assets(),
    queryFn: () => pimService.getAssets(),
  });

export const useAttributesQuery = () =>
  useQuery({
    queryKey: queryKeys.attributes(),
    queryFn: () => pimService.getAttributes(),
  });

export const useIntegrationsQuery = () =>
  useQuery({
    queryKey: queryKeys.integrations(),
    queryFn: () => pimService.getIntegrations(),
  });

export const useImportExportHistoryQuery = () =>
  useQuery({
    queryKey: queryKeys.importExportHistory(),
    queryFn: () => pimService.getImportExportHistory(),
  });

export const useAnalyticsMetricsQuery = () =>
  useQuery({
    queryKey: queryKeys.analyticsMetrics(),
    queryFn: () => pimService.getAnalyticsMetrics(),
  });

export const useTeamMembersQuery = () =>
  useQuery({
    queryKey: queryKeys.teamMembers(),
    queryFn: () => pimService.getTeamMembers(),
  });

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Brand, "id">) => pimService.createBrand(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Brand, "id">> }) =>
      pimService.updateBrand(payload.id, payload.data),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
      await queryClient.invalidateQueries({ queryKey: [...queryKeys.brands(), variables.id] });
    },
  });
};

export const useDeleteBrandMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteBrand(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.brands() });
    },
  });
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Category, "id">) => pimService.createCategory(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.categories() });
      const previous = queryClient.getQueryData<Category[]>(queryKeys.categories()) ?? [];
      const optimisticItem: Category = {
        id: `temp-category-${Date.now()}`,
        ...payload,
      };
      queryClient.setQueryData<Category[]>(queryKeys.categories(), [...previous, optimisticItem]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.categories(), context.previous);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Category, "id">> }) =>
      pimService.updateCategory(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.products() });
    },
  });
};

export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Product, "id">) => pimService.createProduct(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products() });
      const previous = queryClient.getQueryData<Product[]>(queryKeys.products()) ?? [];
      const optimisticItem: Product = {
        id: `temp-product-${Date.now()}`,
        ...payload,
      };
      queryClient.setQueryData<Product[]>(queryKeys.products(), [...previous, optimisticItem]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.products(), context.previous);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Product, "id">> }) =>
      pimService.updateProduct(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products() });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories() });
    },
  });
};

export const useCreateAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Asset, "id">) => pimService.createAsset(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.assets() });
    },
  });
};

export const useUpdateAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Asset, "id">> }) =>
      pimService.updateAsset(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.assets() });
    },
  });
};

export const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteAsset(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.assets() });
    },
  });
};

export const useCreateAttributeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Attribute, "id">) => pimService.createAttribute(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
    },
  });
};

export const useUpdateAttributeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Attribute, "id">> }) =>
      pimService.updateAttribute(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
    },
  });
};

export const useDeleteAttributeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteAttribute(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.attributes() });
    },
  });
};

export const useUpdateIntegrationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<Integration, "id">> }) =>
      pimService.updateIntegration(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.integrations() });
    },
  });
};

export const useCreateImportExportHistoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<ImportExportHistoryItem, "id">) =>
      pimService.createImportExportHistoryItem(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.importExportHistory() });
    },
  });
};

export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<TeamMember, "id">) => pimService.createTeamMember(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers() });
    },
  });
};

export const useDeleteTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: PimEntityId) => pimService.deleteTeamMember(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers() });
    },
  });
};

export const useUpdateTeamMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: PimEntityId; data: Partial<Omit<TeamMember, "id">> }) =>
      pimService.updateTeamMember(payload.id, payload.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.teamMembers() });
    },
  });
};
