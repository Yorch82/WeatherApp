export const getWeatherErrorMessage = (error) => {
  const code = error?.response?.status;
  const apiMessage = error?.response?.data?.message;

  if (error?.code === 'MISSING_API_KEY') {
    return 'Falta la API key de OpenWeather. Añádela en tu archivo .env.';
  }

  if (error?.code === 'CITY_NOT_FOUND') {
    return 'No hemos encontrado esa ciudad. Prueba con otro nombre.';
  }

  if (code === 401) {
    return 'La API key de OpenWeather no es válida o aún no está activa.';
  }

  if (code === 404) {
    return 'No hay datos para esa ubicación.';
  }

  if (code === 429) {
    return 'Se han superado las consultas permitidas. Inténtalo en un minuto.';
  }

  if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
    return 'No se pudo conectar con el servicio del tiempo. Revisa tu conexión.';
  }

  if (typeof apiMessage === 'string' && apiMessage.trim()) {
    return apiMessage;
  }

  return 'No se pudo cargar el tiempo. Inténtalo de nuevo.';
};

export const getGeolocationErrorMessage = (error) => {
  switch (error?.code) {
    case 1:
      return 'Has bloqueado el acceso a tu ubicación. Actívalo en el navegador.';
    case 2:
      return 'No se pudo determinar tu ubicación.';
    case 3:
      return 'La ubicación ha tardado demasiado. Inténtalo de nuevo.';
    default:
      return 'No se pudo obtener tu ubicación.';
  }
};
