// Evento para manejar el inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const messageDiv = document.getElementById('message');
    const welcomeContainer = document.getElementById('welcome-container');
    const loginContainer = document.querySelector('.login-container');
    const adminOptions = document.getElementById('admin-options');
    const userOptions = document.getElementById('user-options');

    // Evento para manejar el cierre de sesión 
    function logout() {
        // Confirmar si el usuario realmente desea cerrar sesión
        if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
            // Eliminar datos de sesión almacenados
            sessionStorage.clear(); // Limpia datos de la sesión
            localStorage.clear(); // Limpia datos persistentes (si los usas)
    
            // Redirigir al usuario a la página de inicio de sesión
            window.location.href = "index.html"; // Cambia "login.html" por la URL de tu página de inicio de sesión
        }
    }
    // Simulación de validación de credenciales
    const provisionalUser = 'provisionalUser';
    const provisionalPassword = 'provisionalPass123';

    if ((username === 'admin' && password === 'admin123' && role === 'admin') ||
        (username === provisionalUser && password === provisionalPassword)) {
        loginContainer.style.display = 'none';
        welcomeContainer.style.display = 'block';
        if (role === 'admin') {
            adminOptions.style.display = 'block';
        } else {
            userOptions.style.display = 'block';
        }
    } else {
        messageDiv.textContent = 'Usuario o contraseña incorrectos.';
    }
});

// Función para ocultar todos los formularios
function hideAllForms() {
    const forms = [
        'register-product-form',
        'search-product-container',
        'modify-product-form',
        'delete-product-form',
        'report-container'
    ];
    forms.forEach(formId => {
        document.getElementById(formId).style.display = 'none';
    });
}

// Funciones para mostrar formularios específicos
function showRegisterProductForm() {
    hideAllForms();
    document.getElementById('register-product-form').style.display = 'block';
}

function showModifyProductForm() {
    hideAllForms();
    document.getElementById('modify-product-form').style.display = 'block';
}

function showDeleteProductForm() {
    hideAllForms();
    document.getElementById('delete-product-form').style.display = 'block';
}

function showReportForm() {
    hideAllForms();
    document.getElementById('report-container').style.display = 'block';
}

function showSearchProductForm() {
    hideAllForms();
    document.getElementById('search-product-container').style.display = 'block';
}

// Función para cerrar formularios o ventanas
function closeForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

// Evento para manejar el formulario de Registrar Producto
document.getElementById('register-product-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = document.getElementById('cantidad').value; // Cambiado de "unidad" a "cantidad"
    const tipo = document.getElementById('tipo').value;

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ codigo, descripcion, cantidad, tipo })
        });

        if (response.ok) {
            alert('Producto registrado exitosamente.');
            closeForm('register-product-form');
        } else {
            alert('Error al registrar el producto.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el producto.');
    }
});

// Evento para manejar el formulario de Consultar Producto
document.getElementById('search-product-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const searchValue = document.getElementById('search').value.trim();

    try {
        // Simulación de búsqueda (puedes reemplazar esto con una llamada a tu API)
        const response = await fetch(`/api/products?search=${searchValue}`);
        if (response.ok) {
            const product = await response.json();

            // Mostrar los detalles del producto
            document.getElementById('product-id').textContent = product.id || 'N/A';
            document.getElementById('product-name').textContent = product.name || 'N/A';
            document.getElementById('product-unit').textContent = product.unit || 'N/A';
            document.getElementById('product-type').textContent = product.type || 'N/A';

            document.getElementById('search-results').style.display = 'block';
        } else {
            alert('Producto no encontrado.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al buscar el producto.');
    }
});

// Evento para manejar el formulario de Modificar Producto
document.getElementById('modify-product-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const unidad = document.getElementById('unidad').value;
    const tipo = document.getElementById('tipo').value;

    try {
        const response = await fetch(`/api/products/${codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ descripcion, unidad, tipo })
        });

        if (response.ok) {
            alert('Producto modificado exitosamente.');
            closeForm('modify-product-form');
        } else {
            alert('Error al modificar el producto.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al modificar el producto.');
    }
});

// Evento para manejar el formulario de Eliminar Producto
document.getElementById('delete-product-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const codigo = document.getElementById('codigo').value;

    try {
        const response = await fetch(`/api/products/${codigo}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Producto eliminado exitosamente.');
            closeForm('delete-product-form');
        } else {
            alert('Error al eliminar el producto.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto.');
    }
});

// Evento para manejar el formulario de Generar Reporte
document.getElementById('generate-report-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const fecha_inicio = document.getElementById('fecha_inicio').value;
    const fecha_fin = document.getElementById('fecha_fin').value;

    try {
        const response = await fetch(`/api/report?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'reporte.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } else {
            alert('Error al generar el reporte.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al generar el reporte.');
    }
});