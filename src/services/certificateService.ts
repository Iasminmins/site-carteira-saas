
import { useApi } from './ApiProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Certificate interface
export interface Certificate {
  _id?: string;
  id?: string;
  title: string;
  type: string;
  employeeId: string;
  issuedDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'expiring';
  qrCode?: string;
  document?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hook for certificate-related API calls
export const useCertificateService = () => {
  const { api } = useApi();
  const queryClient = useQueryClient();

  // Get all certificates
  const getCertificates = async (): Promise<Certificate[]> => {
    const response = await api.get('/certificates');
    return response.data;
  };

  // Get certificate by ID
  const getCertificateById = async (id: string): Promise<Certificate> => {
    const response = await api.get(`/certificates/${id}`);
    return response.data;
  };

  // Get certificates by employee ID
  const getCertificatesByEmployeeId = async (employeeId: string): Promise<Certificate[]> => {
    const response = await api.get(`/employees/${employeeId}/certificates`);
    return response.data;
  };

  // Create new certificate
  const createCertificate = async (certificate: Omit<Certificate, '_id'>): Promise<Certificate> => {
    const response = await api.post('/certificates', certificate);
    return response.data;
  };

  // Update certificate
  const updateCertificate = async ({ id, ...certificate }: Certificate): Promise<Certificate> => {
    const response = await api.put(`/certificates/${id}`, certificate);
    return response.data;
  };

  // Delete certificate
  const deleteCertificate = async (id: string): Promise<void> => {
    await api.delete(`/certificates/${id}`);
  };

  // React Query hooks
  const useCertificates = () => useQuery({
    queryKey: ['certificates'],
    queryFn: getCertificates,
  });

  const useCertificate = (id: string) => useQuery({
    queryKey: ['certificate', id],
    queryFn: () => getCertificateById(id),
    enabled: !!id,
  });

  const useEmployeeCertificates = (employeeId: string) => useQuery({
    queryKey: ['employeeCertificates', employeeId],
    queryFn: () => getCertificatesByEmployeeId(employeeId),
    enabled: !!employeeId,
  });

  const useCreateCertificate = () => useMutation({
    mutationFn: createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });

  const useUpdateCertificate = () => useMutation({
    mutationFn: updateCertificate,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['certificate', data.id] });
      if (data.employeeId) {
        queryClient.invalidateQueries({ queryKey: ['employeeCertificates', data.employeeId] });
      }
    },
  });

  const useDeleteCertificate = () => useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });

  return {
    useCertificates,
    useCertificate,
    useEmployeeCertificates,
    useCreateCertificate,
    useUpdateCertificate,
    useDeleteCertificate,
  };
};
