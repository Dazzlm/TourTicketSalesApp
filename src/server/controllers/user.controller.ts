import { UserService } from "../services/user.service";
import { AppError } from "../errors/AppError";
import { NextResponse } from "next/server";

export const UserController = {
  create: async (req: Request) => {
    try {
      const { cedula, email, name } = await req.json();
      const user = await UserService.findOrCreate({ cedula, email, name });
      return NextResponse.json(user);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      const message = err instanceof Error ? err.message : "Error interno";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  },

  getByCedula: async (cedula: string) => {
    try {
      const user = await UserService.findByCedula(cedula);
      return NextResponse.json(user);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      const message = err instanceof Error ? err.message : "Error interno";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }
};