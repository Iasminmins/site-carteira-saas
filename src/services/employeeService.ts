
import { useApi } from './ApiProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Employee interface
export interface Employee {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  cpf: string;
  role: string;
  photo?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

// Hook for employee-related API calls
export const useEmployeeService = () => {
  const { api } = useApi();
  const queryClient = useQueryClient();

  // Get all employees
  const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
  };

  // Get employee by ID
  const getEmployeeById = async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  };

  // Create new employee
  const createEmployee = async (employee: Omit<Employee, '_id'>): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data;
  };

  // Update employee
  const updateEmployee = async ({ id, ...employee }: Employee): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  };

  // Delete employee
  const deleteEmployee = async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  };

  // React Query hooks
  const useEmployees = () => useQuery({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });

  const useEmployee = (id: string) => useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });

  const useCreateEmployee = () => useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  const useUpdateEmployee = () => useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
    },
  });

  const useDeleteEmployee = () => useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    useEmployees,
    useEmployee,
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
  };
};
