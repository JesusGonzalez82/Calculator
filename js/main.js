// Variables Globales
let operacionActual = '';
let operacionAnterior = '';
let operador = null;
let debeResetear = false;
let historial = [];
let modoAvanzado = false;

// Elementos del DOM
let pantalla;
let historialPanel;
let historialLista;
let modoIndicator;

// Función Principal para agregar operadores
function agregar(valor){
    if (valor === '='){
        calcular()
        return;
    }

    if(['+', '-', '*', '/'].includes(valor)){
        manejarOperador(valor);
        return;
    }

    if (valor === '.'){
        agregarDecimal();
        return;
    }

    agregarNumero(valor);
}

//Funciona agregar numeros
function agregarNumero(numero){
    if(pantalla.textContent === '0' || debeResetear){
        pantalla.textContent = numero;
        debeResetear = false;
    }else{
        //Limito la cantidad de numeros en pantalla
        if (pantalla.textContent.length < 15){
            pantalla.textContent += numero;
        }
    }
    operacionActual = pantalla.textContent;
}

// Funciona agregar punto decimal
function agregarDecimal(){
    if (debeResetear){
        pantalla.textContent = '0.';
        debeResetear = false;
    } else if (!pantalla.textContent.includes('.')) {
        pantalla.textContent += '.';
    }
    operacionActual = pantalla.textContent;
}

// Manejar operadores
function manejarOperador(nuevoOperador){
    const valorActual = parseFloat(operacionActual);

    if(operacionAnterior === ''){
        operacionAnterior = valorActual;
    }else if (operador){
        const resultado = realizarCalculo();
        pantalla.textContent = formatearNumero(resultado);
        operacionAnterior = resultado;
    }

    operador = nuevoOperador;
    debeResetear = true;
}

// Realizar Calculos
function realizarCalculo(){
    const anterior = parseFloat(operacionAnterior);
    const actual = parseFloat(operacionActual);

    if (isNaN(anterior) || isNaN(actual)) return actual;

    switch(operador){
        case '+':
            return anterior + actual;
        case '-':
            return anterior - actual;
        case '*':
            return anterior * actual;
        case '/':
            if (actual === 0){
                mostrarError('Error: No se puede dividir entre 0');
                return anterior
            }
            return anterior / actual;
        default:
            return actual;
    }
}

// Funcion Calcular (cuando presionamos la tecla =)
function calcular(){
    if (operador === null || debeResetear) return;

    const resultado = realizarCalculo();
    const operacionCompleta = `${operacionAnterior} ${operador} ${operacionActual} = ${formatearNumero(resultado)}`;

    // Agregamos el resultado al historial
    agregarAlHistorial(operacionCompleta);

    pantalla.textContent = formatearNumero(resultado);
    operacionAnterior = '';
    operador = null;
    debeResetear = true;
}

// Formatear números

function formatearNumero(numero){
    if (numero === Infinity || numero === -Infinity || isNaN(numero) ){
        return 'error';
    }

    if (Number.isInteger(numero)){
        return numero.toString();
    }

    return parseFloat(numero.toFixed(8)).toString();
}

// Mostrar errores

function mostrarError(mensaje){
    pantalla.textContent = mensaje;
    setTimeout(() => {
        limpiarTodo();
    }, 2000);
}

// Limpiar todo

function limpiarTodo(){
    operacionActual = '';
    operacionAnterior = '';
    operador = null;
    pantalla.textContent = '0';
    debeResetear = false;
}

// Borrar el último caracter

function borrarUltimo(){
    if (pantalla.textContent.length > 1){
        pantalla.textContent = pantalla.textContent.slice(0, -1);
    }else{
        pantalla.textContent = '0';
    }
    operacionActual = pantalla.textContent;
}

// Funciones del Historial

function agregarAlHistorial(operacion){
    historial.unshift(operacion); // Agregamos al inicio
    if (historial.length > 50){ // Ponemos un límite al historial
        historial = historial.slice(0, 50);
    }
    actualizarHistorialUI();
}

function actualizarHistorialUI(){
    if (historial.length === 0){
        historialLista.innerHTML = '<p class="historial-vacio">No hay operaciones aún</p>';
        return;
    }

    historialLista.innerHTML = historial.map(operacion =>
        `<div class="historial-item" onclick="usarDelHistorial('${operacion.split(' = ')[1]}')">${operacion}</div>`
    ).join('');
}

function usarDelHistorial(resultado){
    pantalla.textContent = resultado;
    operacionActual = resultado;
    debeResetear = true;
    toogleHistorial();
}

function limpiarHistorial(){
    historial = [];
    actualizarHistorialUI();
}

function toogleHistorial(){
    historialPanel.classList.toggle('show');
}

// Cambiar entre modo básico y avanzado

function cambiarModo(){
    modoAvanzado = !modoAvanzado;

    if (modoAvanzado){
         modoIndicator.textContent = 'Avanzado';
         mostrarBotonesAvanzados();
    }else{
        modoIndicator.textContent = 'Básico';
        ocultarBotonesAvanzados();
    }
}

function mostrarBotonesAvanzados(){
    // Futura actualización con botones cientificos, por ahora solo cambiar el cartel basico/avanzado
    console.log('Modo avanzado activado');
}

function ocultarBotonesAvanzados(){
    // Futura actualización con botones cientificos, por ahora solo cambiar el cartel basico/avanzado
    console.log('Modo básico activado');
}

// Soporte para utilizar teclado físico

document.addEventListener('keydown', function(event){
    const key = event.key;

    // Numeros
    if (key >= '0' && key <= '9'){
        agregar(key);
    }
    // Operadores
    else if (['+', '-', '*', '/'].includes(key)){
        agregar(key);
    }
    // Punto decial
    else if (key === '.' || key === ','){
        agregar('.');
    }
    // iguak (=)
    else if (key === 'Enter' || key === '='){
        event.preventDefault();
        calcular();
    }
    // Limpiar
    else if (key === 'Escape' || key.toLowerCase() === 'c'){
        limpiarTodo();
    }
    // Borrar
    else if (key === 'Backspace'){
        event.preventDefault();
        borrarUltimo();
    }
});

// Inicializacion

document.addEventListener('DOMContentLoaded', function(){
    pantalla = document.getElementById('pantalla');
    historialPanel = document.getElementById('historial-panel');
    historialLista = document.getElementById('historial-lista');
    modoIndicator = document.getElementById('modo-indicator');

    actualizarHistorialUI();

    // Cerrar historial al hacer clic fuera
    document.addEventListener('click', function(event) {
        if (historialPanel && !historialPanel.contains(event.target) && 
            !event.target.closest('[onclick*="toogleHistorial"]')) {
            historialPanel.classList.remove('show');
        }
    });
});

