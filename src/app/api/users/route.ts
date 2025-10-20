
import { UserController } from"../../../server/controllers/user.controller"

export async function GET(req: Request) {
  const url = new URL(req.url);
  const cedula = url.searchParams.get("cedula") || "";
  return await UserController.getByCedula(cedula);    
}

export async function POST(req: Request) {
    return await UserController.create(req);
}
