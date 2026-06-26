import { Router } from "express";
import { autenticarJWT, requireAdmin } from "../middlewares/authMiddleware";
import { listarUsuarios, perfilUsuario } from "../controllers/usuarioController";

const router = Router();

router.get("/perfil", autenticarJWT, perfilUsuario);
router.get("/", autenticarJWT, requireAdmin, listarUsuarios);

export default router;
