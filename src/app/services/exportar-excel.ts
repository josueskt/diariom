import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { ResumenCuenta } from '../interface/tansaction.interface';

@Injectable({
  providedIn: 'root'
})
export class ExportarExcelService {
  constructor() { }

 // En exportar-excel.service.ts
exportarAExcel(resumenes: ResumenCuenta[], nombreArchivo: string): void {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  // Objeto para llevar registro de nombres usados
  const nombresUsados = new Map<string, number>();

  resumenes.forEach(resumen => {
    // Generar nombre único para la hoja
    let nombreHoja = resumen.cuenta.nombre.substring(0, 31).replace(/[\\/*?:[\]]/g, '');
    
    // Si el nombre ya existe, agregar un número
    if (nombresUsados.has(nombreHoja)) {
      const contador = nombresUsados.get(nombreHoja)! + 1;
      nombresUsados.set(nombreHoja, contador);
      nombreHoja = `${nombreHoja.slice(0, 28)}_${contador}`;
    } else {
      nombresUsados.set(nombreHoja, 1);
    }

    // Resto del código para preparar los datos...
    const datosHoja = [
      ['Cuenta:', resumen.cuenta.nombre],
      ['Saldo:', resumen.cuenta.saldo],
      [],
      ['Fecha', 'Descripción', 'Débito', 'Crédito']
    ];
    
    resumen.transacciones.forEach(trans => {
      datosHoja.push([
        trans.fecha +"",
        trans.descripcion,
        trans.debito,
        trans.credito
      ]);
    });
    
    datosHoja.push(
      [],
      ['Total', '', 
       resumen.transacciones.reduce((sum, t) => sum + (t.debito || 0), 0),
       resumen.transacciones.reduce((sum, t) => sum + (t.credito || 0), 0)
      ],
      ['Saldo', '', '', this.calcularTotales(resumen).saldo]
    );
    
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(datosHoja);
    XLSX.utils.book_append_sheet(wb, ws, nombreHoja);
  });
  
  XLSX.writeFile(wb, `${nombreArchivo}.xlsx`);
}

calcularTotales(resumen: ResumenCuenta): any {
  const totalDebito = resumen.transacciones.reduce((sum, t) => sum + (t.debito || 0), 0);
  const totalCredito = resumen.transacciones.reduce((sum, t) => sum + (t.credito || 0), 0);
  
  return {
    totalDebito,
    totalCredito,
    saldo: totalDebito - totalCredito  // Calculamos el saldo en base a las transacciones
  };
}
}