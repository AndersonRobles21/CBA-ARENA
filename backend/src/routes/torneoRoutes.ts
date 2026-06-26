import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import {
  crearTorneo,
  listarTorneos,
  obtenerTorneo,
  actualizarTorneo,
  eliminarTorneo,
  obtenerEstadisticas,
  obtenerUltimosTorneos,
} from "../controllers/torneoController";

const router = Router();

router.get("/", autenticarJWT, listarTorneos);
router.get("/ultimos", autenticarJWT, obtenerUltimosTorneos);
router.get("/estadisticas", autenticarJWT, obtenerEstadisticas);
router.get("/:id", autenticarJWT, obtenerTorneo);
router.post("/", autenticarJWT, crearTorneo);
router.put("/:id", autenticarJWT, actualizarTorneo);
router.delete("/:id", autenticarJWT, eliminarTorneo);

export default router;
