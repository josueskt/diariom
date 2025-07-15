import { Component } from '@angular/core';
import { Cuenta, ResumenCuenta, Transaccion } from '../interface/tansaction.interface';
import { Libros } from './libros';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportarExcelService } from '../services/exportar-excel';

@Component({
  selector: 'app-libro',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './libro.html',
  styleUrl: './libro.css'
})
export class Libro {
   resumenes: ResumenCuenta[] = [];
  cuentas: Cuenta[] = [];
  nuevaTransaccion = {
    cuentaId: 0,
    descripcion: '',
    debito: 0,
    credito: 0
  };
  nuevaCuenta = {
    nombre: ''
  };

  constructor(private transaccionService: Libros ,  private exportarExcelService: ExportarExcelService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cuentas = this.transaccionService.obtenerCuentas();
    this.resumenes = this.transaccionService.obtenerResumenCuentas();
     console.log("Datos cargados:", {
    resumenes: this.resumenes,
    cuentas: this.cuentas
  });
  }
  exportarAExcel(): void {
  const nombreArchivo = `LibroMayor_${new Date().toISOString().split('T')[0]}`;
  this.exportarExcelService.exportarAExcel(this.resumenes, nombreArchivo);
}

  crearCuenta(): void {
    if (!this.nuevaCuenta.nombre) return;
    
    this.transaccionService.crearCuenta(this.nuevaCuenta.nombre);
    this.nuevaCuenta.nombre = '';
    this.cargarDatos();
  }

  agregarTransaccion(): void {
    console.log("asd")
    if (!this.nuevaTransaccion.cuentaId || !this.nuevaTransaccion.descripcion) return;
    
    this.transaccionService.agregarTransaccion(
      this.nuevaTransaccion.cuentaId,
      this.nuevaTransaccion.descripcion,
      this.nuevaTransaccion.debito,
      this.nuevaTransaccion.credito
    );
    
    this.cargarDatos();
    this.resetFormTransaccion();
  }

  // En libro-mayor.component.ts
calcularTotales(resumen: ResumenCuenta): any {
  const totalDebito = resumen.transacciones.reduce((sum, t) => sum + (t.debito || 0), 0);
  const totalCredito = resumen.transacciones.reduce((sum, t) => sum + (t.credito || 0), 0);
  
  return {
    totalDebito,
    totalCredito,
    saldo: totalDebito - totalCredito  // Calculamos el saldo en base a las transacciones
  };
}
  eliminarCuenta(id: number): void {
    if (confirm('¿Está seguro de eliminar esta cuenta y todas sus transacciones?')) {
      this.transaccionService.eliminarCuenta(id);
      this.cargarDatos();
    }
  }
  eliminarTransaccion(transaccionId: number): void {
  if (confirm('¿Está seguro de eliminar esta transacción?')) {
    this.transaccionService.eliminarTransaccion(transaccionId);
    this.cargarDatos();
  }
}

eliminarTodasTransacciones(cuentaId: number): void {
  if (confirm('¿Está seguro de eliminar TODAS las transacciones de esta cuenta?')) {
    this.transaccionService.eliminarTodasTransaccionesCuenta(cuentaId);
    this.cargarDatos();
  }
}

  resetFormTransaccion(): void {
    this.nuevaTransaccion = {
      cuentaId: 0,
      descripcion: '',
      debito: 0,
      credito: 0
    };
  }

  getSaldoTotal(): number {
    return this.cuentas.reduce((total, cuenta) => total + cuenta.saldo, 0);
  }

}
