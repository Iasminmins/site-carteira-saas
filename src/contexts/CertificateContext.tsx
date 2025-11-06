
import { createContext, useState, useContext, ReactNode } from "react";
import { toast } from "sonner";
import { generateCertificateQRCode } from "@/lib/qrcode";

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
  companyId?: string; // Added for multi-tenancy
};

type Employee = {
  id: string;
  name: string;
  photo: string;
  companyId?: string; // Added for multi-tenancy
};

type Company = {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  createdAt: Date;
  isActive: boolean;
}

type CertificateContextType = {
  certificates: Certificate[];
  employees: Employee[];
  companies: Company[]; // Added for multi-tenancy
  isLoading: boolean;
  addCertificate: (certificate: Omit<Certificate, "id" | "qrCode">) => void;
  getCertificate: (id: string) => Certificate | undefined;
  getEmployeeCertificates: (employeeId: string) => Certificate[];
  getFilteredCertificates: (status?: string, companyId?: string) => Certificate[];
  getCurrentCompany: () => Company | undefined;
};

// Mock company data for multi-tenancy
const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Industrial Tech",
    domain: "industrialtech.meusistema.com",
    logo: "https://via.placeholder.com/150?text=IT",
    createdAt: new Date('2023-01-01'),
    isActive: true
  },
  {
    id: "2",
    name: "Safety First Corp",
    domain: "safetyfirst.meusistema.com",
    logo: "https://via.placeholder.com/150?text=SF",
    createdAt: new Date('2023-02-15'),
    isActive: true
  }
];

// Mock employee data
const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "João Silva",
    photo: "https://i.pravatar.cc/150?img=3",
    companyId: "1"
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    photo: "https://i.pravatar.cc/150?img=12",
    companyId: "1"
  },
  {
    id: "3",
    name: "Ana Beatriz",
    photo: "https://i.pravatar.cc/150?img=5",
    companyId: "1"
  },
  {
    id: "4",
    name: "Roberto Martins",
    photo: "https://i.pravatar.cc/150?img=20",
    companyId: "2"
  },
  {
    id: "5",
    name: "Maria Santos",
    photo: "https://i.pravatar.cc/150?img=9",
    companyId: "2"
  }
];

// Generate QR codes dynamically using the configured domain
const mockCertificates: Certificate[] = [
  {
    id: "cert-001",
    title: "NR-10 - Segurança em Instalações e Serviços em Eletricidade",
    type: "NR",
    issuedDate: new Date('2023-01-15'),
    expiryDate: new Date('2025-01-15'),
    status: "valid",
    qrCode: generateCertificateQRCode("cert-001"),
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12",
    companyId: "1"
  },
  {
    id: "cert-002",
    title: "NR-12 - Segurança no Trabalho em Máquinas e Equipamentos",
    type: "NR",
    issuedDate: new Date('2023-02-10'),
    expiryDate: new Date('2025-02-10'),
    status: "valid",
    qrCode: generateCertificateQRCode("cert-002"),
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12",
    companyId: "1"
  },
  {
    id: "cert-003",
    title: "NR-33 - Espaço Confinado",
    type: "NR",
    issuedDate: new Date('2022-05-15'),
    expiryDate: new Date('2023-05-15'),
    status: "expired",
    qrCode: generateCertificateQRCode("cert-003"),
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12",
    companyId: "1"
  },
  {
    id: "cert-004",
    title: "NR-35 - Trabalho em Altura",
    type: "NR",
    issuedDate: new Date('2023-03-20'),
    expiryDate: new Date('2023-06-20'),
    status: "expiring",
    qrCode: generateCertificateQRCode("cert-004"),
    employeeId: "2",
    employeeName: "Carlos Oliveira",
    employeePhoto: "https://i.pravatar.cc/150?img=12",
    companyId: "1"
  },
  {
    id: "cert-005",
    title: "ISO 9001 - Sistema de Gestão da Qualidade",
    type: "ISO",
    issuedDate: new Date('2023-01-05'),
    expiryDate: new Date('2026-01-05'),
    status: "valid",
    qrCode: generateCertificateQRCode("cert-005"),
    employeeId: "3",
    employeeName: "Ana Beatriz",
    employeePhoto: "https://i.pravatar.cc/150?img=5",
    companyId: "1"
  },
  {
    id: "cert-006",
    title: "NR-20 - Líquidos Combustíveis e Inflamáveis",
    type: "NR",
    issuedDate: new Date('2022-11-10'),
    expiryDate: new Date('2023-11-10'),
    status: "expiring",
    qrCode: generateCertificateQRCode("cert-006"),
    employeeId: "4", 
    employeeName: "Roberto Martins",
    employeePhoto: "https://i.pravatar.cc/150?img=20",
    companyId: "2"
  }
];

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export const CertificateProvider = ({ children }: { children: ReactNode }) => {
  const [certificates, setCertificates] = useState<Certificate[]>(mockCertificates);
  const [isLoading, setIsLoading] = useState(false);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [companies] = useState<Company[]>(mockCompanies);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>("1"); // Default to first company

  const addCertificate = (certificateData: Omit<Certificate, "id" | "qrCode">) => {
    setIsLoading(true);
    try {
      // Generate a unique ID
      const id = `cert-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`;
      
      // Generate QR code using utility function
      const qrCode = generateCertificateQRCode(id, 150);
      
      const newCertificate: Certificate = {
        ...certificateData,
        id,
        qrCode,
        companyId: currentCompanyId  // Assign to current company
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
    return certificates.filter(cert => 
      cert.employeeId === employeeId && 
      cert.companyId === currentCompanyId
    );
  };

  const getFilteredCertificates = (status?: string, companyId: string = currentCompanyId) => {
    let filtered = certificates.filter(cert => cert.companyId === companyId);
    
    if (!status || status === "all") return filtered;
    return filtered.filter(cert => cert.status === status);
  };

  const getCurrentCompany = () => {
    return companies.find(company => company.id === currentCompanyId);
  };

  return (
    <CertificateContext.Provider 
      value={{ 
        certificates, 
        employees,
        companies,
        isLoading, 
        addCertificate, 
        getCertificate,
        getEmployeeCertificates,
        getFilteredCertificates,
        getCurrentCompany
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
