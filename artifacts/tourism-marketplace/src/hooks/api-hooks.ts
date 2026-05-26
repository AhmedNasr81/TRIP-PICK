import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  CountryOut, ProgramSimple, ProgramDetail, CompanyOut,
  ReviewOut, AdminStatsOut, UserListOut, UserOut, ProgramImageOut
} from '@/lib/types';

// --- COUNTRIES ---
export const useCountries = () => useQuery({
  queryKey: ['countries'],
  queryFn: async () => (await api.get<CountryOut[]>('/api/countries')).data
});

export const useCountry = (id: number | string) => useQuery({
  queryKey: ['countries', id],
  queryFn: async () => (await api.get<CountryOut>(`/api/countries/${id}`)).data,
  enabled: !!id,
});

export const useCountryPrograms = (countryId: number | string, params?: Record<string, any>) => useQuery({
  queryKey: ['countries', countryId, 'programs', params],
  queryFn: async () => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== -1 && value !== '-1' && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    return (await api.get<ProgramSimple[]>(`/api/countries/${countryId}/programs?${searchParams.toString()}`)).data;
  },
  enabled: !!countryId,
});

// --- PROGRAMS ---
export const usePrograms = (params?: Record<string, any>) => useQuery({
  queryKey: ['programs', params],
  queryFn: async () => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== -1 && value !== '-1' && value !== '') {
          searchParams.append(key, value.toString());
        }
      });
    }
    return (await api.get<ProgramSimple[]>(`/api/programs?${searchParams.toString()}`)).data;
  }
});

export const useProgram = (id: number | string) => useQuery({
  queryKey: ['programs', id],
  queryFn: async () => (await api.get<ProgramDetail>(`/api/programs/${id}`)).data,
  enabled: !!id,
});

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post<ProgramDetail>('/api/programs', data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });
};

export const useUpdateProgram = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.put<ProgramDetail>(`/api/programs/${id}`, data)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
      queryClient.invalidateQueries({ queryKey: ['programs', id] });
    }
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => (await api.delete(`/api/programs/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs'] })
  });
};

export const useUploadProgramImage = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      return (await api.post<ProgramDetail>(`/api/programs/${id}/image`, formData)).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs', id] })
  });
};

export const useAddProgramGalleryImage = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      return (await api.post<ProgramImageOut>(`/api/programs/${id}/images`, formData)).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['programs', id] })
  });
};

// --- COMPANIES ---
export const useCompanies = (params?: Record<string, any>) => useQuery({
  queryKey: ['companies', params],
  queryFn: async () => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== -1 && value !== '-1') {
          searchParams.append(key, value.toString());
        }
      });
    }
    return (await api.get<CompanyOut[]>(`/api/companies?${searchParams.toString()}`)).data;
  }
});

export const useCompany = (id: number | string) => useQuery({
  queryKey: ['companies', id],
  queryFn: async () => (await api.get<CompanyOut>(`/api/companies/${id}`)).data,
  enabled: !!id,
});

export const useMyCompany = () => useQuery({
  queryKey: ['companies', 'me'],
  queryFn: async () => (await api.get<CompanyOut>('/api/companies/me')).data,
  retry: false,
});

export const useUpdateMyCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.put<CompanyOut>('/api/companies/me', data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies', 'me'] })
  });
};

export const useUploadMyCompanyImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      return (await api.post<CompanyOut>('/api/companies/me/image', formData)).data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies', 'me'] })
  });
};

export const useCreateCompanyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/api/auth/company-profile', data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['companies', 'me'] })
  });
};

// --- FAVORITES ---
export const useFavorites = (page = 1, pageSize = 20) => useQuery({
  queryKey: ['favorites', page, pageSize],
  queryFn: async () => (await api.get<ProgramSimple[]>(`/api/favorites?page=${page}&page_size=${pageSize}`)).data
});

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isFavorited }: { id: number | string, isFavorited: boolean }) => {
      if (isFavorited) {
        return (await api.delete(`/api/favorites/${id}`)).data;
      } else {
        return (await api.post(`/api/favorites/${id}`)).data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['programs', variables.id] });
    }
  });
};

// --- REVIEWS ---
export const useReviews = (companyId: number | string, page = 1, pageSize = 20) => useQuery({
  queryKey: ['reviews', companyId, page, pageSize],
  queryFn: async () => (await api.get<ReviewOut[]>(`/api/companies/${companyId}/reviews?page=${page}&page_size=${pageSize}`)).data,
  enabled: !!companyId,
});

export const useMyReviewId = (companyId: number | string) => useQuery({
  queryKey: ['reviews', 'me', companyId],
  queryFn: async () => (await api.get<{ review_id: number }>(`/api/review_id/${companyId}`)).data,
  enabled: !!companyId,
  retry: false,
});

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { company_id: number, rate: number, comment: string }) => (await api.post<ReviewOut>('/api/reviews', data)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.company_id] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'me', variables.company_id] });
      queryClient.invalidateQueries({ queryKey: ['companies', variables.company_id] });
    }
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, companyId }: { reviewId: number | string, companyId: number | string }) => (await api.delete(`/api/reviews/${reviewId}`)).data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'me', variables.companyId] });
      queryClient.invalidateQueries({ queryKey: ['companies', variables.companyId] });
    }
  });
};

// --- ADMIN ---
export const useAdminStats = () => useQuery({
  queryKey: ['admin', 'stats'],
  queryFn: async () => (await api.get<AdminStatsOut>('/api/admin/stats')).data
});

export const useAdminUsers = (params?: Record<string, any>) => useQuery({
  queryKey: ['admin', 'users', params],
  queryFn: async () => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') searchParams.append(key, value.toString());
      });
    }
    return (await api.get<UserListOut[]>(`/api/admin/users?${searchParams.toString()}`)).data;
  }
});

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: number | string, is_active: boolean }) => 
      (await api.put(`/api/admin/users/${id}/status`, { is_active })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  });
};

export const useCreateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => (await api.post<CountryOut>('/api/admin/countries', data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['countries'] })
  });
};

export const useUploadCountryImage = (id: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      return (await api.post<CountryOut>(`/api/admin/countries/${id}/image`, formData)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
      queryClient.invalidateQueries({ queryKey: ['countries', id] });
    }
  });
};
