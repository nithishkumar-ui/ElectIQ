import { Router, Request, Response } from "express";
import { getElectionPhases } from "../services/electionData";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ countries: ["us", "uk", "india", "canada", "australia"] });
});

router.get("/:country", (req: Request, res: Response) => {
  const data = getElectionPhases(req.params.country);
  if (!data) {
    return res.status(404).json({ detail: `No election data for: ${req.params.country}` });
  }
  res.json(data);
});

export default router;
