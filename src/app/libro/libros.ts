import { Injectable } from '@angular/core';
import { Cuenta, ResumenCuenta, Transaccion } from '../interface/tansaction.interface';

@Injectable({
  providedIn: 'root'
})
export class Libros {
  private cuentasKey = 'libroMayor_cuentas';
  private transaccionesKey = 'libroMayor_transacciones';

  constructor() { }

eliminarTransaccion(id: number): void {
  let transacciones = this.obtenerTransacciones();
  const transaccion = transacciones.find(t => t.id === id);
  
  if (transaccion) {
    // Actualizar saldo de la cuenta
    let cuentas = this.obtenerCuentas();
    cuentas = cuentas.map(c => {
      if (c.id === transaccion.cuentaId) {
        return { ...c, saldo: c.saldo - transaccion.debito + transaccion.credito };
      }
      return c;
    });
    
    // Guardar cambios
    localStorage.setItem(this.cuentasKey, JSON.stringify(cuentas));
    transacciones = transacciones.filter(t => t.id !== id);
    localStorage.setItem(this.transaccionesKey, JSON.stringify(transacciones));
  }
}

eliminarTodasTransaccionesCuenta(cuentaId: number): void {
  let transacciones = this.obtenerTransacciones();
  transacciones = transacciones.filter(t => t.cuentaId !== cuentaId);
  localStorage.setItem(this.transaccionesKey, JSON.stringify(transacciones));
}

  // Métodos para Cuentas
  crearCuenta(nombre: string): Cuenta {
    const cuentas = this.obtenerCuentas();
    const nuevaCuenta: Cuenta = {
      id: Date.now(),
      nombre,
      saldo: 0
    };
    cuentas.push(nuevaCuenta);
    localStorage.setItem(this.cuentasKey, JSON.stringify(cuentas));
    return nuevaCuenta;
  }

  obtenerCuentas(): Cuenta[] {
    const data = localStorage.getItem(this.cuentasKey);
    return data ? JSON.parse(data) : [];
  }

  // Métodos para Transacciones
  agregarTransaccion(cuentaId: number, descripcion: string, debito: number, credito: number): Transaccion {
    const transacciones = this.obtenerTransacciones();
    const cuentas = this.obtenerCuentas();
    
    const nuevaTransaccion: Transaccion = {
      id: Date.now(),
      fecha: new Date(),
      cuentaId,
      descripcion,
      debito,
      credito
    };

    // Actualizar saldo de la cuenta
    const cuentaIndex = cuentas.findIndex(c => c.id === cuentaId);
    if (cuentaIndex >= 0) {
      cuentas[cuentaIndex].saldo += debito - credito;
      localStorage.setItem(this.cuentasKey, JSON.stringify(cuentas));
    }

    transacciones.push(nuevaTransaccion);
    localStorage.setItem(this.transaccionesKey, JSON.stringify(transacciones));
    
    return nuevaTransaccion;
  }

  obtenerTransacciones(): Transaccion[] {
    const data = localStorage.getItem(this.transaccionesKey);
    return data ? JSON.parse(data) : [];
  }

 obtenerResumenCuentas(): ResumenCuenta[] {
  const cuentas = this.obtenerCuentas();
  const transacciones = this.obtenerTransacciones();

  // Debug: Verificar datos crudos
  console.log('Cuentas en storage:', cuentas);
  console.log('Transacciones en storage:', transacciones);

  return cuentas.map(cuenta => {
    // Filtrar transacciones y asegurar tipo numérico para los IDs
    const transaccionesCuenta = transacciones.filter(t => 
      Number(t.cuentaId) === Number(cuenta.id)
    );

    // Debug: Verificar coincidencias
    console.log(`Transacciones para cuenta ${cuenta.id}:`, transaccionesCuenta);

    return {
      cuenta: { ...cuenta },
      transacciones: transaccionesCuenta
    };
  });
}

  eliminarCuenta(id: number): void {
    let cuentas = this.obtenerCuentas();
    cuentas = cuentas.filter(c => c.id !== id);
    localStorage.setItem(this.cuentasKey, JSON.stringify(cuentas));

    let transacciones = this.obtenerTransacciones();
    transacciones = transacciones.filter(t => t.cuentaId !== id);
    localStorage.setItem(this.transaccionesKey, JSON.stringify(transacciones));
  }
  
}
