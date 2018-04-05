import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-programs',
  templateUrl: './config-programs.component.html'
})
export class ConfigProgramsComponent implements OnInit {

  cadenaReferencia:any[] = [];
  marcoReferencia:number = 0;
  datosPendientes:boolean;
  fallos:any[] = [];
  matrizAlgoritmo:any[][] = [];
  alerta = false;
  verMarco = false;

  cantidadFallos:number = 0;
  cantidadReferencias:number = 0;
  frecuencias:number = 0;
  rendimiento:number = 0;

  constructor() { }

  ngOnInit() {
  }

  getCadenaReferencia(){
    return this.cadenaReferencia;
  }

  addReferencia(p_valor:string){
    this.cadenaReferencia.push(p_valor);
  }

  removeReferencia(p_valor:string){
    this.cadenaReferencia.splice(this.cadenaReferencia.indexOf(p_valor), 1);
  }

  addMarco(p_marco:number){
    this.marcoReferencia = p_marco;

    if(this.marcoReferencia > 0){
      this.verMarco = true;
    }
    else{
      this.verMarco = false;
    }
  }

  validacionAlerta(){
    if(this.cadenaReferencia.length == 0){
      this.alerta = true;
    }
    else if(this.marcoReferencia == 0){
      this.alerta = true;
    }
    else
    {
      this.alerta = false;
    }
  }

  calculoTotales(){
    this.cantidadFallos = 0;
    for (let variable of this.fallos) {
        if(variable){
          this.cantidadFallos++;
        }
    }

    this.cantidadReferencias = this.cadenaReferencia.length;

    this.frecuencias = this.cantidadFallos / this.cantidadReferencias;

    this.rendimiento = 1-this.frecuencias;
  }

  algoritmoSCA(p_tipo:number):any[]{
    //validaciones
      this.validacionAlerta();
      if(this.alerta){
          return;
      }

    //Reiniciamos las matrices
    this.matrizAlgoritmo = [];
    this.fallos = [];
    let index_cadena = 0;
    //Recorremos cada posicion de la cadena de referecnia
    for (let item of this.cadenaReferencia) {

      //Si es el primer elemento creamos la primer pagina
      if (this.matrizAlgoritmo.length == 0){
        let arreglo_temp = [item.toString() + "Ω"];
        for (let i = 0; i < this.marcoReferencia -1; i++) {
          arreglo_temp.push (".");
        }
        this.matrizAlgoritmo.push(arreglo_temp);
        this.fallos.push(true);
      }// si no iniciaremos la copia apartir de la anterior
      else
      {
        //insertamos una copia de la columna anterior
        this.matrizAlgoritmo.push(this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1].concat());

        let i_c:number = 0;
        let fallo:boolean = true;

        for (let variable of this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1]) {
          //Si el iten ya existe no hacemos nada solo posteamos el fallo
          if(variable.toString().replace("ß", "").replace("Ω", "") == item.toString().replace("ß", "").replace("-Ω", ""))
          {
            this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][i_c] = item.toString() + "ß"
            fallo = false;
            this.fallos.push(false);
            break;
          }
          else if(variable == "."){ //Si hay una celda vacia lo insertamos
            this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][i_c] = item.toString() + "Ω";
            fallo = false;
            this.fallos.push(true);
            break;
          }
          i_c++;
        }

        //Si es true necesita de un algoritmo
        if (fallo){
            this.fallos.push(true);
            this.algoritmoFifo(item, true);
        }
      }
      index_cadena++;
    }
    this.calculoTotales();
    return this.trasposeMatrix(this.matrizAlgoritmo);
  }

  algoritmo(p_tipo:number):any[]{
    //validaciones
    this.validacionAlerta();
    if(this.alerta){
        return;
    }

    //Reiniciamos las matrices
    this.matrizAlgoritmo = [];
    this.fallos = [];
    let index_cadena = 0;
    //Recorremos cada posicion de la cadena de referecnia
    for (let item of this.cadenaReferencia) {

      //Si es el primer elemento creamos la primer pagina
      if (this.matrizAlgoritmo.length == 0){
        let arreglo_temp = [item];
        for (let i = 0; i < this.marcoReferencia -1; i++) {
          arreglo_temp.push (".");
        }
        this.matrizAlgoritmo.push(arreglo_temp);
        this.fallos.push(true);
      }// si no iniciaremos la copia apartir de la anterior
      else
      {
        //insertamos una copia de la columna anterior
        this.matrizAlgoritmo.push(this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1].concat());

        let i_c:number = 0;
        let fallo:boolean = true;

        for (let variable of this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1]) {
          //Si el iten ya existe no hacemos nada solo posteamos el fallo
          if(variable == item)
          {
            fallo = false;
            this.fallos.push(false);
            break;
          }
          else if(variable == "."){ //Si hay una celda vacia lo insertamos
            this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][i_c] = item;
            fallo = false;
            this.fallos.push(true);
            break;
          }
          i_c++;
        }

        //Si es true necesita de un algoritmo
        if (fallo){
          this.fallos.push(true);
          if(p_tipo == 1){
            this.algoritmoFifo(item, false);
          }
          else if(p_tipo == 2)
          {
            this.algoritmoOpt(item, index_cadena);
          }
          else if (p_tipo == 3){
            this.algoritmoLRU(item, index_cadena);
          }
        }
      }
      index_cadena++;
    }
    this.calculoTotales();
    return this.trasposeMatrix(this.matrizAlgoritmo);
  }

  algoritmoFifo(p_item:any, sca:boolean){
    //Creamos un marco para almacenar los conteos del fifo
    let marco_fifo:any[] = [];
    for (let i = 0; i <= this.marcoReferencia - 1; i++) {
      marco_fifo.push(0);
    }

    //Nos movemos a la ultima columna y ultimo elemento y lo recorremos en revese
    //Si el elemento coincide sumamos en la posicion donde se encontraba
    for (let i = this.matrizAlgoritmo.length - 2; i >= 0; i--){
      for (let j = this.matrizAlgoritmo[i].length - 1; j >= 0; j--) {
        for (let i_2 = this.matrizAlgoritmo.length - this.marcoReferencia - 1; i_2 >= 0; i_2--){
          if(this.matrizAlgoritmo[i_2][j].toString().replace("ß", "").replace("Ω", "") == this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2][j].toString().replace("ß", "").replace("Ω", ""))
          {
            if(sca){
              if(this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2][j].indexOf("Ω") > 0)
              {
                marco_fifo[j]++;
              }
            }
            else{
              marco_fifo[j]++;
            }
          }
        }
      }
    }

    //Tomamos el mayor del marco_fifo y ahi obtemos la posicion donde haremos el reemplazo
    let mm = -1;
    let yy = -1;
    for (let i = 0; i <= marco_fifo.length -1; i++) {
      if(marco_fifo[i] > mm){
        mm = marco_fifo[i];
        yy = i;
      }
    }

    //hacemos el reemplazo
    if(sca){
      this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][yy] = p_item.toString() + "Ω";
    }
    else{
      this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][yy] = p_item;
    }
  }

  algoritmoOpt(p_item:any, p_index:number){
    let i_index_reemplazo:number = 0;
    let aplica:boolean = true;
    let array_exist:any[] = [];

    //seteamos el array_exist
    for (let i = 0; i <= this.marcoReferencia -1; i++) {
        array_exist.push(0);
    }

    //revisar si todos existen
    for (let i = 0; i <= this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2].length; i++) {
      for (let i_2 = 0; i_2 <= this.cadenaReferencia.length -1; i_2++) {
          if( i_2 >= p_index){
            if(this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2][i] == this.cadenaReferencia[i_2]){
                array_exist[i] = i_2;
            }
          }
      }
    }

    //si aplica
    let aplica_l = 0;
    for (let variable of array_exist) {
        if(variable == 0){
          aplica_l++;
        }
    }

    if(aplica_l == this.marcoReferencia -1){
      aplica = false;
    }

    if(aplica){
      let i_valor:number = 0;
      for (let i = 0; i <= array_exist.length; i++) {
          if(array_exist[i] >= i_valor){
            i_index_reemplazo = i;
            i_valor = array_exist[i];
          }
      }
      this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][i_index_reemplazo] = p_item;
    }
    else{
      this.algoritmoFifo(p_item, false);
    }
  }

  algoritmoLRU(p_item:any, p_index:number){
    let i_index_reemplazo:number = 0;
    let array_exist:any[] = [];

    //seteamos el array_exist
    for (let i = 0; i <= this.marcoReferencia -1; i++) {
        array_exist.push(0);
    }

    //revisar si todos existen
    for (let i = 0; i <= this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2].length; i++) {
      for (let i_2 = this.cadenaReferencia.length -1; i_2 >= 0; i_2--) {
          if( i_2 < p_index){
            if(this.matrizAlgoritmo[this.matrizAlgoritmo.length - 2][i] == this.cadenaReferencia[i_2]){
              if(array_exist[i] < i_2){
                array_exist[i] = i_2;
              }
            }
          }
      }
    }

    let i_valor:number = p_index;
    for (let i = 0; i <= array_exist.length; i++) {
        if(array_exist[i] <= i_valor){
          i_index_reemplazo = i;
          i_valor = array_exist[i];
        }
    }
    this.matrizAlgoritmo[this.matrizAlgoritmo.length - 1][i_index_reemplazo] = p_item;
  }

  trasposeMatrix(matrix:any[][]):any[][]
  {
    for (let i=0; i<matrix.length-1; i++) {
      for (let j=i+1; j<matrix.length; j++) {
        let tmp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = tmp;
      }
    }

    for (let i=0; i<matrix.length-1; i++) {
      if(!matrix[i][0]){
        matrix.splice(i);
      }
    }
    return matrix;
  }
}
