// Función para mostrar un mensaje en la UI en lugar de alert()
function showUIMessage(message, isSuccess = true) {
  let messageBox = document.getElementById('uiMessageBox');
  if (!messageBox) {
    messageBox = document.createElement('div');
    messageBox.id = 'uiMessageBox';
    document.body.appendChild(messageBox);
    // Estilos básicos para el mensaje
    Object.assign(messageBox.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: '1000',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center'
    });
  }

  messageBox.textContent = message;
  messageBox.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336'; // Verde para éxito, rojo para error
  messageBox.style.opacity = '1';

  // Ocultar el mensaje después de 3 segundos
  setTimeout(() => {
    messageBox.style.opacity = '0';
  }, 3000);
}

const form = document.getElementById('registerForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const dataForm = new FormData(form);
  const obj = {};
  // Convierte los datos del formulario a un objeto JSON
  dataForm.forEach((value, key) => {
    obj[key] = value;
  });

  console.log("AQUI", obj)
  try {
    const response = await fetch('/api/sessions/register', {
      method: 'POST',
      body: JSON.stringify(obj), 
      headers: {
        'Content-Type': 'application/json' 
      }
    });

    // Parsear la respuesta JSON del servidor
    const result = await response.json(); // Ahora sí, espera la promesa de json()

    console.log("Respuesta del servidor:", result); // Log para depuración

    if (response.status === 200) {
      showUIMessage("¡Usuario creado con éxito!", true); // Mensaje de éxito
      // Redirige al usuario a la página de login después de un breve retraso para que vea el mensaje
      setTimeout(() => {
        window.location.replace('/users/login');
      }, 1500); // Espera 1.5 segundos
    } else {
      // Maneja errores basados en el estado HTTP y el mensaje del servidor
      showUIMessage(result.message || "No se pudo crear el usuario. Inténtelo de nuevo.", false); // Mensaje de error
    }
  } catch (error) {
    // Captura cualquier error de red o de la solicitud fetch
    console.error("Error al intentar registrarse:", error);
    showUIMessage("Ocurrió un error de conexión. Por favor, inténtelo de nuevo más tarde.", false);
  }
});
