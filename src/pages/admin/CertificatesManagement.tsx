
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCertificates } from "@/contexts/CertificateContext";
import { useAuth } from "@/contexts/AuthContext";
import { EmployeeCard } from "@/components/EmployeeCard";
import { useMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  Search,
  FileCheck,
  ListCheck,
  Eye,
  Certificate
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CertificatesManagement = () => {
  const navigate = useNavigate();
  const { isMobile, isMenuOpen, toggleMenu } = useMobile();
  const { certificates, getFilteredCertificates } = useCertificates();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    const matchesEmployee =
      employeeFilter === "all" || cert.employeeId === employeeFilter;

    return matchesSearch && matchesStatus && matchesEmployee;
  });

  // Get unique employees from certificates
  const uniqueEmployees = [
    ...new Map(
      certificates
        .filter((cert) => cert.employeeId && cert.employeeName)
        .map((cert) => [
          cert.employeeId,
          {
            id: cert.employeeId,
            name: cert.employeeName,
            photo: cert.employeePhoto,
          },
        ])
    ).values(),
  ];

  // Get certificates for a specific employee
  const getEmployeeCertificates = (employeeId: string) => {
    return certificates.filter((cert) => cert.employeeId === employeeId);
  };

  // Stats for dashboard
  const validCount = certificates.filter((cert) => cert.status === "valid").length;
  const expiringCount = certificates.filter((cert) => cert.status === "expiring").length;
  const expiredCount = certificates.filter((cert) => cert.status === "expired").length;
  const totalCertificates = certificates.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Válido
          </Badge>
        );
      case "expired":
        return <Badge variant="destructive">Expirado</Badge>;
      case "expiring":
        return <Badge variant="secondary">Expirando</Badge>;
      default:
        return <Badge variant="outline">Indeterminado</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isMenuOpen} />
      <div className="flex-1">
        <Header showMenuToggle={true} onMenuToggle={toggleMenu} />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Gerenciamento de Certificados</h1>
              <p className="text-gray-600">Visualize e gerencie os certificados da equipe</p>
            </div>
            <Button
              className="mt-4 md:mt-0"
              onClick={() => navigate("/admin/certificates/new")}
            >
              <Plus className="mr-1" size={18} /> Novo Certificado
            </Button>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total de Certificados</CardDescription>
                <CardTitle>{totalCertificates}</CardTitle>
              </CardHeader>
              <CardContent>
                <FileCheck className="text-gray-400" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Certificados Válidos</CardDescription>
                <CardTitle className="text-green-600">{validCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <ListCheck className="text-green-600" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Expirando</CardDescription>
                <CardTitle className="text-amber-500">{expiringCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <ListCheck className="text-amber-500" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Expirados</CardDescription>
                <CardTitle className="text-red-600">{expiredCount}</CardTitle>
              </CardHeader>
              <CardContent>
                <ListCheck className="text-red-600" />
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Buscar certificados..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="valid">Válidos</SelectItem>
                  <SelectItem value="expiring">Expirando</SelectItem>
                  <SelectItem value="expired">Expirados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Colaborador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Colaboradores</SelectItem>
                  {uniqueEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de Colaboradores com opção de gerar carteirinha */}
          {employeeFilter !== "all" && (
            <div className="mb-6">
              {uniqueEmployees
                .filter(emp => emp.id === employeeFilter)
                .map(employee => {
                  const employeeCertificates = getEmployeeCertificates(employee.id);
                  return (
                    <Card key={employee.id} className="mb-4">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                              {employee.photo && (
                                <img
                                  src={employee.photo}
                                  alt={employee.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{employee.name}</CardTitle>
                              <CardDescription>ID: {employee.id}</CardDescription>
                            </div>
                          </div>
                          <EmployeeCard
                            name={employee.name}
                            id={employee.id}
                            photo={employee.photo}
                            certificates={employeeCertificates}
                          />
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
            </div>
          )}

          {/* Certificates Table */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Colaborador</TableHead>
                      <TableHead>Emissão</TableHead>
                      <TableHead>Validade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCertificates.length > 0 ? (
                      filteredCertificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell className="font-medium">{cert.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {cert.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                                {cert.employeePhoto && (
                                  <img
                                    src={cert.employeePhoto}
                                    alt={cert.employeeName}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              {cert.employeeName}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(cert.issuedDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell
                            className={
                              cert.status === "valid"
                                ? "text-green-600"
                                : cert.status === "expired"
                                ? "text-red-600"
                                : "text-amber-600"
                            }
                          >
                            {format(new Date(cert.expiryDate), "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>{getStatusBadge(cert.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/certificate/${cert.id}`, "_blank")}
                            >
                              <Eye size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Nenhum certificado encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default CertificatesManagement;
