import { Router } from "express";
import { autenticarJWT } from "../middlewares/authMiddleware";
import {
  crearEquipo,
  listarEquipos,
  obtenerEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from "../controllers/equipoController";

const router = Router();

router.get("/", autenticarJWT, listarEquipos);
router.get("/:id", autenticarJWT, obtenerEquipo);
router.post("/", autenticarJWT, crearEquipo);
router.put("/:id", autenticarJWT, actualizarEquipo);
router.delete("/:id", autenticarJWT, eliminarEquipo);

export default router;
