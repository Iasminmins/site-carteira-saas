
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Plus, Search, Users, FileBarChart2, Globe, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useCertificates } from '@/contexts/CertificateContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const CompanyManagement = () => {
  const { companies, employees, certificates } = useCertificates();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({ 
    name: '', 
    domain: '',
    admin_name: '',
    admin_email: ''
  });
  
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCompanyData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddCompany = () => {
    // This would connect to an API in a real implementation
    toast.success(`Empresa ${newCompanyData.name} adicionada com sucesso!`);
    setIsAddDialogOpen(false);
    setNewCompanyData({ name: '', domain: '', admin_name: '', admin_email: '' });
  };
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Empresas</h1>
          <p className="text-muted-foreground">Cadastro e administração de tenants da plataforma</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para adicionar uma nova empresa à plataforma.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newCompanyData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Ex: Industrial Tech"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="domain" className="text-right">
                  Domínio
                </Label>
                <Input
                  id="domain"
                  name="domain"
                  value={newCompanyData.domain}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Ex: industrialtech.meusistema.com"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin_name" className="text-right">
                  Administrador
                </Label>
                <Input
                  id="admin_name"
                  name="admin_name"
                  value={newCompanyData.admin_name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Nome do administrador"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin_email" className="text-right">
                  E-mail Admin
                </Label>
                <Input
                  id="admin_email"
                  name="admin_email"
                  value={newCompanyData.admin_email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" onClick={handleAddCompany}>
                Adicionar Empresa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Empresas Registradas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar empresa..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Empresa</TableHead>
                  <TableHead>Domínio</TableHead>
                  <TableHead className="text-center">Usuários</TableHead>
                  <TableHead className="text-center">Certificados</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Nenhuma empresa encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => {
                    const companyUsers = employees.filter(e => e.companyId === company.id).length;
                    const companyCerts = certificates.filter(c => c.companyId === company.id).length;
                    
                    return (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              {company.logo ? (
                                <img 
                                  src={company.logo} 
                                  alt={company.name} 
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <Building2 size={16} className="text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p>{company.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ID: {company.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Globe size={14} className="mr-1 text-muted-foreground" />
                            {company.domain}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <Users size={14} className="mr-1 text-blue-500" />
                            {companyUsers}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <FileBarChart2 size={14} className="mr-1 text-emerald-500" />
                            {companyCerts}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={company.isActive ? "default" : "destructive"} className="justify-center min-w-20">
                            {company.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toast.info("Visualizando detalhes da empresa")}>
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toast.info("Editando empresa")}>
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => toast.info("Status da empresa alterado")} className="text-amber-500">
                                {company.isActive ? "Desativar" : "Ativar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Multi-tenancy</CardTitle>
          <CardDescription>
            Defina como os dados das empresas serão isolados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Isolamento por Schema</h4>
              <p className="text-sm text-muted-foreground">Cada empresa terá seu próprio schema no banco de dados</p>
            </div>
            <Switch id="schema-isolation" checked={true} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Prefixos de Tabela</h4>
              <p className="text-sm text-muted-foreground">Incluir prefixo company_id em todas as tabelas</p>
            </div>
            <Switch id="table-prefix" checked={false} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Middleware de Segurança</h4>
              <p className="text-sm text-muted-foreground">Validação de acesso a dados entre tenants</p>
            </div>
            <Switch id="security-middleware" checked={true} />
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div>
              <h4 className="font-medium">Criptografia de IDs</h4>
              <p className="text-sm text-muted-foreground">IDs em URLs não serão sequenciais</p>
            </div>
            <Switch id="id-encryption" checked={true} />
          </div>
        </CardContent>
        <CardFooter className="justify-end border-t p-4">
          <Button onClick={() => toast.success("Configurações salvas com sucesso")}>
            Salvar Configurações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CompanyManagement;
