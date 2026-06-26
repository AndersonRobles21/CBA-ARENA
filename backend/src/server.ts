import express from "express";
import cors from "cors";
import { pool } from "./config/db";
import { initDb } from "./config/initDb";
import authRoutes from "./routes/authRoutes";
import usuarioRoutes from "./routes/usuarioRoutes";
import torneoRoutes from "./routes/torneoRoutes";
import equipoRoutes from "./routes/equipoRoutes";
import partidaRoutes from "./routes/partidaRoutes";
import recursoReadRoutes from "./routes/recursoReadRoutes";
import recursoCreateRoutes from "./routes/recursoCreateRoutes";
import recursoUpdateRoutes from "./routes/recursoUpdateRoutes";
import recursoDeleteRoutes from "./routes/recursoDeleteRoutes";
import reservaReadRoutes from "./routes/reservaReadRoutes";
import reservaCreateRoutes from "./routes/reservaCreateRoutes";
import reservaDeleteRoutes from "./routes/reservaDeleteRoutes";
import reservaUpdateRoutes from "./routes/reservaUpdateRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/torneos", torneoRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/partidas", partidaRoutes);
app.use('/api/recursos', recursoReadRoutes);
app.use('/api/recursos', recursoCreateRoutes);
app.use('/api/recursos', recursoUpdateRoutes);
app.use('/api/recursos', recursoDeleteRoutes);
app.use('/api/reservas', reservaReadRoutes);
app.use('/api/reservas', reservaCreateRoutes);
app.use('/api/reservas', reservaDeleteRoutes);
app.use('/api/reservas', reservaUpdateRoutes);

initDb().catch((error) => {
  console.error("Error inicializando la base de datos:", error);
});

app.get("/api", async (_req, res) => {
  try {
    const resultado = await pool.query("SELECT NOW()");
    res.json(resultado.rows[0]);
  } catch (error) {
    console.error("ERROR COMPLETO:", error);

    res.status(500).json({
      error: String(error),
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});