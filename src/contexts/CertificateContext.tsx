
import { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";

type Certificate = {
  id: string;
  title: string;
  type: string;
  issuedDate: Date;
  expiryDate: Date;
  status: "valid" | "expired" | "expiring";
  qrCode: string;
  employeeId?: string;
  employeeName?: string;
  employeePhoto?: string;
};

type Employee = {
  id: string;
  name: string;
  photo: string;
};

type CertificateContextType = {
  certificates: Certificate[];
  employees: Employee[];
  isLoading: boolean;
  addCertificate: (certificate: Omit<Certificate, "id" | "qrCode">) => void;
  getCertificate: (id: string) => Certificate | undefined;
  getEmployeeCertificates: (employeeId: string) => Certificate[];
  getFilteredCertificates: (status?: string) => Certificate[];
};

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "João Silva",
    photo: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    photo: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "3",
    name: "Ana Beatriz",
    photo: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "4",
    name: "Roberto Martins",
    photo: "https://i.pravatar.cc/150?img=20"
  },
  {
    id: "5",
    name: "Maria Santos",
    photo: "https://i.pravatar.cc/150?img=9"
  }
];

const mockCertificates: Certificate[] = [
  {
    id: "cert-001",
    title: "NR-10 - Segurança em Instalações e Serviços em Eletricidade",
    type: "NR",
    issuedDate: new Date('2023-01-15'),
    expiryDate: new Date('2025-01-15'),
    status: "valid",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-001",
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "cert-002",
    title: "NR-12 - Segurança no Trabalho em Máquinas e Equipamentos",
    type: "NR",
    issuedDate: new Date('2023-02-10'),
    expiryDate: new Date('2025-02-10'),
    status: "valid",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-002",
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "cert-003",
    title: "NR-33 - Espaço Confinado",
    type: "NR",
    issuedDate: new Date('2022-05-15'),
    expiryDate: new Date('2023-05-15'),
    status: "expired",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-003",
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "cert-004",
    title: "NR-35 - Trabalho em Altura",
    type: "NR",
    issuedDate: new Date('2023-03-20'),
    expiryDate: new Date('2023-06-20'),
    status: "expiring",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-004",
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "cert-005",
    title: "ISO 9001 - Sistema de Gestão da Qualidade",
    type: "ISO",
    issuedDate: new Date('2023-01-05'),
    expiryDate: new Date('2026-01-05'),
    status: "valid",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-005",
    employeeId: "3",
    employeeName: "Ana Beatriz",
    employeePhoto: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "cert-006",
    title: "NR-20 - Líquidos Combustíveis e Inflamáveis",
    type: "NR",
    issuedDate: new Date('2022-11-10'),
    expiryDate: new Date('2023-11-10'),
    status: "expiring",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=cert-006",
    employeeId: "4", 
    employeeName: "Roberto Martins",
    employeePhoto: "https://i.pravatar.cc/150?img=20"
  }
];

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider = ({ children }: { children: ReactNode }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [isLoading, setIsLoading] = useState(false);
  const [employees] = useState<Employee[]>(mockEmployees);

  const addCertificate = (certificateData: Omit<Certificate, "id" | "qrCode">) => {
    setIsLoading(true);
    try {
      // Generate a unique ID
      const id = `cert-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      // Generate QR code URL
      const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${id}`;
      
      const newCertificate: Certificate = {
        ...certificateData,
        id,
        qrCode
      };
      
      setCertificates(prev => [...prev, newCertificate]);
      toast.success("Certificado adicionado com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar certificado");
    } finally {
      setIsLoading(false);
    }
  };

  const getCertificate = (id: string) => {
    return certificates.find(cert => cert.id === id);
  };

  const getEmployeeCertificates = (employeeId: string) => {
    return certificates.filter(cert => cert.employeeId === employeeId);
  };

  const getFilteredCertificates = (status?: string) => {
    if (!status || status === "all") return certificates;
    return certificates.filter(cert => cert.status === status);
  };

  return (
    <CertificateContext.Provider 
      value={{ 
        certificates, 
        employees,
        isLoading, 
        addCertificate, 
        getCertificate,
        getEmployeeCertificates,
        getFilteredCertificates
      }}
    >
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error("useCertificates must be used within a CertificateProvider");
  }
  return context;
};
