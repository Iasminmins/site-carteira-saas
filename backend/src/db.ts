// backend/src/db.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || '';

const connectDB = async () => {
  if (!MONGO_URI) {
    console.error('❌ A variável MONGODB_URI não foi definida no arquivo .env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      // Essas opções já são defaults no mongoose@7+, mas você ainda pode customizar se quiser:
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: 'certifit', // o nome do banco que quer usar (pode ser outro nome se quiser)
    });
    console.log(`✅ MongoDB (Mongoose) conectado em: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Erro ao conectar no MongoDB (Mongoose):', err);
    process.exit(1);
  }
};

export default connectDB;
