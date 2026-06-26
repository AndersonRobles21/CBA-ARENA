import express from 'express';
import cors from 'cors';
import { pool } from '../backend/src/config/db';
import { initDb } from '../backend/src/config/initDb';
import authRoutes from '../backend/src/routes/authRoutes';
import usuarioRoutes from '../backend/src/routes/usuarioRoutes';
import torneoRoutes from '../backend/src/routes/torneoRoutes';
import equipoRoutes from '../backend/src/routes/equipoRoutes';
import partidaRoutes from '../backend/src/routes/partidaRoutes';
import recursoReadRoutes from '../backend/src/routes/recursoReadRoutes';
import recursoCreateRoutes from '../backend/src/routes/recursoCreateRoutes';
import recursoUpdateRoutes from '../backend/src/routes/recursoUpdateRoutes';
import recursoDeleteRoutes from '../backend/src/routes/recursoDeleteRoutes';
import reservaReadRoutes from '../backend/src/routes/reservaReadRoutes';
import reservaCreateRoutes from '../backend/src/routes/reservaCreateRoutes';
import reservaDeleteRoutes from '../backend/src/routes/reservaDeleteRoutes';
import reservaUpdateRoutes from '../backend/src/routes/reservaUpdateRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/torneos', torneoRoutes);
app.use('/api/equipos', equipoRoutes);
app.use('/api/partidas', partidaRoutes);
app.use('/api/recursos', recursoReadRoutes);
app.use('/api/recursos', recursoCreateRoutes);
app.use('/api/recursos', recursoUpdateRoutes);
app.use('/api/recursos', recursoDeleteRoutes);
app.use('/api/reservas', reservaReadRoutes);
app.use('/api/reservas', reservaCreateRoutes);
app.use('/api/reservas', reservaDeleteRoutes);
app.use('/api/reservas', reservaUpdateRoutes);

initDb().catch((error) => {
  console.error('Error inicializando la base de datos:', error);
});

app.get('/api', async (_req, res) => {
  try {
    const resultado = await pool.query('SELECT NOW()');
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('ERROR COMPLETO:', error);
    res.status(500).json({ error: String(error) });
  }
});

export default app;
