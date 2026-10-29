<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Http\Request;

// Configuración principal de la aplicación y del manejo global de excepciones.
return Application::configure(basePath: dirname(__DIR__))
  ->withExceptions(function (Exceptions $exceptions): void {
    // Convierte las excepciones de las rutas API en respuestas JSON controladas.
    $exceptions->render(function (Throwable $e, Request $request) {
      // Las rutas web mantienen el manejo de errores normal de Laravel.
      if (! $request->is('api/*')) {
        return null;
      }

      // Laravel ya conoce cómo devolver los errores de validación por campo.
      if ($e instanceof ValidationException) {
        return null;
      }

      // Una sesión inválida siempre se comunica como 401, sin detalles internos.
      if ($e instanceof AuthenticationException) {
        return response()->json([
          'message' => 'Tu sesión venció. Volvé a iniciar sesión.',
          'code' => 'unauthenticated',
        ], 401);
      }

      // Mantiene códigos HTTP conocidos, pero reemplaza sus mensajes por textos seguros.
      if ($e instanceof HttpExceptionInterface) {
        $status = $e->getStatusCode();
        $mensajes = [
          403 => 'No tenés permiso para hacer esto.',
          404 => 'No encontramos lo que buscabas.',
          429 => 'Hiciste demasiados intentos. Esperá un momento.',
        ];

        return response()->json([
          'message' => $mensajes[$status]
            ?? 'No pudimos completar la solicitud. Intentá de nuevo.',
          'code' => 'request_error',
        ], $status);
      }

      // Los detalles quedan registrados en el servidor, nunca en la respuesta al cliente.
      report($e); // el detalle real queda en storage/logs

      // Las excepciones de base de datos reciben un estado específico para permitir reintentos.
      $esBaseDeDatos = $e instanceof QueryException;

      // Todas las demás excepciones reciben un mensaje genérico para no filtrar credenciales,
      // consultas SQL, rutas internas ni trazas de ejecución.
      return response()->json([
        'message' => $esBaseDeDatos
          ? 'El servicio no está disponible en este momento. Intentá de nuevo en unos minutos.'
          : 'Ocurrió un error inesperado. Intentá de nuevo.',
        'code' => $esBaseDeDatos ? 'service_unavailable' : 'server_error',
      ], $esBaseDeDatos ? 503 : 500);
    });
  })
  ->create();
