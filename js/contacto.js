// Archivo de lógica para la página de contacto.
// Valida los campos del formulario en tiempo real y muestra un mensaje
// de éxito al enviar correctamente la información.

document.addEventListener("DOMContentLoaded", () => {
    // 1. Captura de elementos del DOM (Inputs, Spans de error y Formulario)
    const inputNombre = document.getElementById('nombre');
    const inputApellido = document.getElementById('apellido');
    const inputEmail = document.getElementById('email');
    const inputRut = document.getElementById('rut');
    const inputCelular = document.getElementById('celular');

    const spanErrorNombre = document.getElementById('error-nombre');
    const spanErrorApellido = document.getElementById('error-apellido');
    const spanErrorEmail = document.getElementById('error-email');
    const spanErrorRut = document.getElementById('error-rut');
    const spanErrorCelular = document.getElementById('error-celular');

    const formulario = document.getElementById('formulario-contacto');
    const contenedorTarjeta = document.getElementById('contenedor-tarjeta');

    // --- FUNCIONES REUTILIZABLES DE VALIDACIÓN ---

    function validarTextoSinNumeros(input, span, mensaje) {
        const valor = input.value;
        const contieneNumeros = /\d/.test(valor);
        if (contieneNumeros) {
            span.textContent = mensaje;
            input.classList.add('error');
        } else {
            span.textContent = '';
            input.classList.remove('error');
        }
    }

    function validarEmail(input, span, mensaje) {
        const valor = input.value;
        const esValido = valor.includes('@') && valor.includes('.');
        if (valor !== '' && !esValido) {
            span.textContent = mensaje;
            input.classList.add('error');
        } else {
            span.textContent = '';
            input.classList.remove('error');
        }
    }

    function validarRut(input, span, mensaje) {
        const valor = input.value;
        const formatoRut = /^\d+-[0-9kK]$/;
        if (valor !== '' && !formatoRut.test(valor)) {
            span.textContent = mensaje;
            input.classList.add('error');
        } else {
            span.textContent = '';
            input.classList.remove('error');
        }
    }

    function validarCelular(input, span, mensaje) {
        const valor = input.value;
        const contieneLetras = /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(valor);
        if (contieneLetras) {
            span.textContent = mensaje;
            input.classList.add('error');
        } else {
            span.textContent = '';
            input.classList.remove('error');
        }
    }

    // --- ASIGNACIÓN DE EVENT LISTENERS (TIEMPO REAL) ---

    inputNombre.addEventListener('input', () => {
        validarTextoSinNumeros(inputNombre, spanErrorNombre, 'El nombre no debe contener números.');
    });

    inputApellido.addEventListener('input', () => {
        validarTextoSinNumeros(inputApellido, spanErrorApellido, 'El apellido no debe contener números.');
    });

    inputEmail.addEventListener('input', () => {
        validarEmail(inputEmail, spanErrorEmail, 'El correo debe contener un "@" y un punto "."');
    });

    inputRut.addEventListener('input', () => {
        validarRut(inputRut, spanErrorRut, 'Formato inválido. Ingrese sin puntos y con guion (ej: 12345678-9).');
    });

    inputCelular.addEventListener('input', () => {
        validarCelular(inputCelular, spanErrorCelular, 'El número de celular no debe contener letras.');
    });

    // --- CONTROL DE ENVÍO (SUBMIT) ---
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue por defecto

        // Verificamos si hay algún input con errores activos o vacíos
        const hayErrores = document.querySelectorAll('.input-estilo.error').length > 0;
        const camposVacios = inputNombre.value === '' || inputApellido.value === '' || inputEmail.value === '' || inputRut.value === '' || inputCelular.value === '';

        if (camposVacios) {
            alert('Por favor, completa todos los campos obligatorios antes de enviar.');
            return;
        }

        if (hayErrores) {
            alert('Por favor, corrige los errores en el formulario antes de enviar.');
            return;
        }

        // Si todo está correcto, transformamos la tarjeta blanca mostrando un mensaje de éxito profesional
        contenedorTarjeta.innerHTML = `
            <div class="mensaje-exito">
                <h2>¡Mensaje Enviado con Éxito!</h2>
                <p>Muchas gracias por contactarte con <strong>Fretería Los Maestros</strong>.</p>
                <p>Hemos recibido tu requerimiento y nos pondremos en contacto contigo a la brevedad. ¡Que tengas un excelente día!</p>
            </div>
        `;
    });
});