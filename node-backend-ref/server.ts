import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ==========================================
// MOTOR DE GAMIFICACIÓN EN TYPESCRIPT / NODE
// ==========================================
interface ReturnCalculation {
  status: 'DEVUELTO_A_TIEMPO' | 'DEVUELTO_TARDE';
  pointsDelta: number;
  hoursLate: number;
  reason: string;
}

function calculateGamificationPoints(deadline: Date, returnTime: Date, toolName: string): ReturnCalculation {
  const diffMs = returnTime.getTime() - deadline.getTime();
  
  if (diffMs <= 0) {
    // A TIEMPO (+10 pts)
    return {
      status: 'DEVUELTO_A_TIEMPO',
      pointsDelta: 10,
      hoursLate: 0,
      reason: `Devolución puntual de herramienta '${toolName}' (+10 pts)`
    };
  }

  // TARDE (-15 base + -5 por hora)
  const hoursLate = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
  const penalty = 15 + (hoursLate * 5);
  return {
    status: 'DEVUELTO_TARDE',
    pointsDelta: -penalty,
    hoursLate,
    reason: `Devolución tardía (${hoursLate}h retraso) de '${toolName}' (-${penalty} pts)`
  };
}

// ==========================================
// ENDPOINTS PRINCIPALES
// ==========================================

// 1. Escaneo Inteligente RFID (HID o Simulado)
app.post('/api/rfid/scan', async (req: Request, res: Response) => {
  const { tag_uid } = req.body;
  if (!tag_uid) return res.status(400).json({ error: 'Tag UID vacío' });

  // Buscar Usuario
  const user = await prisma.user.findUnique({
    where: { tag_uid },
    include: {
      loans: {
        where: { estado: 'ACTIVO' },
        include: { tool: true }
      }
    }
  });

  if (user) {
    const isBlocked = user.puntos < 20 || user.estado === 'BLOQUEADO';
    return res.json({ target: 'user', tag_uid, data: user, bloqueado: isBlocked });
  }

  // Buscar Herramienta
  const tool = await prisma.tool.findUnique({
    where: { tag_uid }
  });

  if (tool) {
    return res.json({ target: 'tool', tag_uid, data: tool });
  }

  return res.status(404).json({ target: 'unknown', message: 'Tag no registrado' });
});

// 2. Checkout de Préstamo
app.post('/api/loans/checkout', async (req: Request, res: Response) => {
  const { user_id, tool_id, custom_hours } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: user_id } });
      if (!user) throw new Error('Usuario no encontrado');
      if (user.puntos < 20 || user.estado === 'BLOQUEADO') {
        throw new Error(`Préstamo denegado: ${user.nombre} tiene ${user.puntos} puntos (mínimo 20)`);
      }

      const tool = await tx.tool.findUnique({ where: { id: tool_id } });
      if (!tool || tool.estado !== 'DISPONIBLE') {
        throw new Error(`La herramienta no está disponible`);
      }

      const hours = custom_hours || tool.tiempo_prestamo_horas;
      const deadline = new Date(Date.now() + hours * 60 * 60 * 1000);

      const loan = await tx.loan.create({
        data: {
          userId: user.id,
          toolId: tool.id,
          fecha_limite: deadline,
          estado: 'ACTIVO'
        }
      });

      await tx.tool.update({
        where: { id: tool.id },
        data: { estado: 'PRESTADA' }
      });

      return { loan, user, tool, deadline };
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// 3. Check-in de Devolución & Cálculo de Gamificación
app.post('/api/loans/checkin', async (req: Request, res: Response) => {
  const { loan_id } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({
        where: { id: loan_id },
        include: { user: true, tool: true }
      });

      if (!loan || loan.estado !== 'ACTIVO') {
        throw new Error('Préstamo no activo o inexistente');
      }

      const returnTime = new Date();
      const calc = calculateGamificationPoints(loan.fecha_limite, returnTime, loan.tool.nombre);
      const newScore = Math.max(0, loan.user.puntos + calc.pointsDelta);

      // Actualizar Usuario
      await tx.user.update({
        where: { id: loan.userId },
        data: { puntos: newScore }
      });

      // Actualizar Préstamo
      await tx.loan.update({
        where: { id: loan.id },
        data: {
          fecha_devolucion: returnTime,
          estado: calc.status
        }
      });

      // Liberar Herramienta
      await tx.tool.update({
        where: { id: loan.toolId },
        data: { estado: 'DISPONIBLE' }
      });

      // Registrar en Ledger
      const ledgerEntry = await tx.pointTransaction.create({
        data: {
          userId: loan.userId,
          loanId: loan.id,
          cantidad: calc.pointsDelta,
          motivo: calc.reason,
          saldo_resultante: newScore
        }
      });

      return {
        loan_id: loan.id,
        user: loan.user.nombre,
        tool: loan.tool.nombre,
        pointsDelta: calc.pointsDelta,
        newScore,
        status: calc.status,
        reason: calc.reason,
        ledgerId: ledgerEntry.id
      };
    });

    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ToolTag Pro Node/Express Server en puerto ${PORT}`);
});
