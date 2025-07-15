export interface Cuenta {
  id: number;
  nombre: string;
  saldo: number;
}

export interface Transaccion {
  id: number;
  fecha: Date;
  cuentaId: number;  // Relación con la cuenta
  descripcion: string;
  debito: number;
  credito: number;
}

export interface ResumenCuenta {
  cuenta: Cuenta;
  transacciones: Transaccion[];
}