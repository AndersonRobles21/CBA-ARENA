import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import {
  crearPartida,
  listarPartidas,
  obtenerPartida,
  actualizarPartida,
  eliminarPartida,
} from "../controllers/partidaController";

const router = Router();

router.get("/", autenticarJWT, listarPartidas);
router.get("/:id", autenticarJWT, obtenerPartida);
router.post("/", autenticarJWT, crearPartida);
router.put("/:id", autenticarJWT, actualizarPartida);
router.delete("/:id", autenticarJWT, eliminarPartida);

export default router;
