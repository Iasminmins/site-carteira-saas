// Script para popular o banco de dados com dados de teste
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db';
import Employee from './models/employee.model';
import Certificate from './models/certificate.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🌱 Conectando ao banco de dados...');
    await connectDB();
    
    console.log('🗑️  Limpando dados existentes...');
    await Employee.deleteMany({});
    await Certificate.deleteMany({});
    
    console.log('👥 Criando funcionários de teste...');
    const employees = await Employee.insertMany([
      {
        name: 'João Silva',
        matricula: '001',
        funcao: 'Técnico em Segurança',
        contrato: 'CLT',
        integrado: new Date('2023-01-15'),
        aso: new Date('2024-06-15'),
        photo: 'https://i.pravatar.cc/150?img=3'
      },
      {
        name: 'Carlos Oliveira',
        matricula: '002',
        funcao: 'Engenheiro Industrial',
        contrato: 'CLT',
        integrado: new Date('2022-05-20'),
        aso: new Date('2024-07-20'),
        photo: 'https://i.pravatar.cc/150?img=12'
      },
      {
        name: 'Maria Santos',
        matricula: '003',
        funcao: 'Técnica em Manutenção',
        contrato: 'CLT',
        integrado: new Date('2023-08-10'),
        aso: new Date('2024-08-10'),
        photo: 'https://i.pravatar.cc/150?img=5'
      }
    ]);
    
    console.log(`✅ ${employees.length} funcionários criados!`);
    
    console.log('📜 Criando certificados de teste...');
    
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const certificates = [];
    
    for (const employee of employees) {
      const certId1 = new mongoose.Types.ObjectId();
      const certId2 = new mongoose.Types.ObjectId();
      
      const cert1 = {
        _id: certId1,
        title: 'NR-10 - Segurança em Instalações e Serviços em Eletricidade',
        type: 'NR',
        employeeId: employee._id,
        issuedDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-15'),
        status: 'valid' as const,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/certificate/${certId1}`)}`
      };
      
      const cert2 = {
        _id: certId2,
        title: 'NR-35 - Trabalho em Altura',
        type: 'NR',
        employeeId: employee._id,
        issuedDate: new Date('2024-03-20'),
        expiryDate: new Date('2025-03-20'),
        status: 'valid' as const,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${baseUrl}/certificate/${certId2}`)}`
      };
      
      certificates.push(cert1, cert2);
    }
    
    await Certificate.insertMany(certificates);
    
    console.log(`✅ ${certificates.length} certificados criados!`);
    console.log('\n🎉 Banco de dados populado com sucesso!\n');
    console.log('📊 Resumo:');
    console.log(`   - ${employees.length} funcionários`);
    console.log(`   - ${certificates.length} certificados`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    process.exit(1);
  }
};

seedDatabase();
