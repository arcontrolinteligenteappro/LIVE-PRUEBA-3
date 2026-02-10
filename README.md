
# AR CONTROL LIVE STUDIO (ARCLS) - System Architecture & Operator's Manual

## 1. Visión e Identidad del Producto

### 1.1. Contexto
**AR CONTROL LIVE STUDIO (ARCLS)** es una aplicación de producción en vivo profesional, diseñada con una filosofía *mobile-first*. Actúa como un estudio de transmisión portátil y completo que integra conmutación de video, mezcla de audio, capas gráficas y control de transmisión en dos interfaces de usuario distintas: **Single Mode** (para operación ágil) y **Studio Mode** (para control total).

### 1.2. Identidad del Producto
ARCLS se siente como una fusión de equipamiento profesional:
-   **ATEM** (para el Switcher de Video)
-   **VirtualDJ** (para la superficie de control y los pads de performance)
-   **Consola de Audio Digital** (para el mezclador de audio)
Todo integrado en una única aplicación cohesiva.

### 1.3. Objetivos Clave del Sistema
-   **PGM Nunca Cae**: La salida a Programa es sagrada. Ningún fallo en un módulo no crítico puede interrumpir la transmisión.
-   **Audio sin Distorsión**: El audio master siempre estará protegido por un limitador.
-   **Rendimiento Optimizado**: El Multiview utilizará proxies de baja resolución para no impactar el rendimiento.
-   **Operación Basada en Comandos**: La UI es un controlador que despacha comandos, desacoplada de la lógica del motor.
-   **Degradación Automática**: El sistema reduce su carga de forma inteligente bajo estrés (térmico, CPU).
-   **Seguridad Operacional**: Incluye un botón **PANIC SAFE**, **Snapshots** y **Macros**.

---

## 2. Principios Fundamentales de Arquitectura

-   **UI (Controlador)**: Envía comandos y refleja el estado actual.
-   **Motores (Ejecutores)**: Módulos de bajo nivel que gestionan los pipelines. Operan en segundo plano.
-   **State Store (Verdad Única)**: Un almacén de estado centralizado. En la simulación, esto es gestionado por el state de React en `App.tsx`.
-   **Event Bus (Comunicación)**: Los motores emiten eventos para notificar cambios. En la simulación, esto se logra mediante el flujo de estado y props de React.

### Sistema de Prioridades (P0-P3)
-   **P0 (Crítico)**: `Video core`, `Audio core`, `Switcher`, `Output`, `State Store`, `Watchdog`.
-   **P1 (Importante)**: `Overlays`, `Multiview proxies`, `Stream router`.
-   **P2/P3 (Opcional)**: `Replay`, `Scoreboard`, `Commerce`, `Chat`, `Lighting`.

---

## 3. Matriz de Módulos (Estructura de Carpetas Lógica)

-   **Núcleo (Core)**: `engine-config`, `engine-state-store`, `engine-event-bus`, `engine-logging`, `engine-watchdog`.
-   **Video**: `engine-video-core`, `engine-source-manager`, `engine-switcher`, `engine-multiview-proxy`, `engine-overlays`.
-   **Audio**: `engine-audio-core`, `engine-audio-mixer`, `engine-mic-lock`, `engine-master-limiter`.
-   **Salida (Output)**: `engine-output`, `engine-rtmp`, `engine-recording`.
-   **UI**: `ui-single-mode`, `ui-studio-mode`, `ui-console-layout`.
-   **Características Opcionales**: `engine-replay`, `engine-scoreboard`, `engine-commerce`, `engine-lighting`.

---

## 4. Modelos de Datos y Reglas de Estado

El `engine-state-store` gestiona un objeto `AppState` que se divide en:
-   `VideoState`: `sources[]`, `previewSourceId`, `programSourceId`, `transitionType`.
-   `AudioState`: `channels[]`, `master`, `micLockEnabled`, `audioFollowVideo`.
-   `OutputState`: `streamingActive`, `recordingActive`, `rtmpTargets[]`.
-   `SystemHealthState`: `temperature`, `cpuLoad`, `degradeLevel`.
-   Estados específicos: `OverlayState`, `ReplayState`, `LightingState`.

---

## 5. Interfaces de Comandos y Eventos

### 5.1. Comandos (Acciones)
La UI interactúa con el sistema despachando comandos.
-   **Video**: `SetPreview`, `Cut`, `AutoTransition`, `SetTransition`.
-   **Audio**: `SetChannelGain/Fader`, `ToggleMute/Solo`, `SetEQ/Compressor`, `MicLock`.
-   **Fuentes**: `SourceAdd`, `SourceRemove`, `SourceUpdate`.
-   **Overlays**: `AddOverlay`, `RemoveOverlay`, `ToggleOverlay`, `UpdateOverlayContent`.
-   **Stream**: `UpdateStreamDestination`.
-   **Output**: `Start/StopStream`, `Start/StopRecording`.
-   **Safety**: `PanicSafe`, `ApplyDegradeLevel`.
-   **Opcionales**: `Replay.Play`, `Scoreboard.Update`, `Lighting.ApplyScene`.

### 5.2. Eventos (Sucesos)
Los motores emiten eventos para notificar cambios.
-   **Video**: `SourceDisconnected`, `ProgramChanged`.
-   **Audio**: `AudioClippingDetected`, `MasterClippingDetected`.
-   **Output**: `StreamReconnecting`, `RecordingStopped`.
-   **System**: `ThermalWarning`, `DegradeLevelChanged`.

---

## 6. Reglas Críticas, Seguridad y Degradación

-   **Master Limiter**: Siempre activo si `audioConsole.enabled = true` y la transmisión o grabación están activas.
-   **Mic Lock**: Si está activo, el micrófono principal no puede ser silenciado accidentalmente.
-   **Multiview por Proxies**: El `Studio Mode` utiliza proxies de baja resolución.
-   **Módulos Opcionales Seguros**: Un fallo en `engine-replay` o `engine-lighting` los desactiva automáticamente sin afectar el PGM.
-   **Watchdog y Degradación Automática**: El `engine-watchdog` aplica niveles de degradación para proteger la transmisión bajo estrés.
-   **Botón "Panic Safe"**: Ejecuta una secuencia de comandos para llevar el sistema a un estado seguro y predecible con un solo toque.

---

## 7. Características Profesionales

-   **Snapshots**: Guardan y cargan el estado completo de la consola, permitiendo configuraciones rápidas para "PRE-SHOW", "LIVE", etc.
-   **Macros**: Permiten ejecutar secuencias de comandos. Ejemplo: Un macro `GO LIVE` puede iniciar la grabación, el stream, y mostrar un gráfico con un solo toque.

---

## 8. Especificaciones de la UI (UI Layout Specs)

### 8.1. UI Adaptativa: El Principio "Un Sistema, Cualquier Pantalla"
ARCLS adopta una arquitectura de UI totalmente adaptativa. En lugar de un selector manual, la aplicación **detecta automáticamente el tamaño del viewport** y renderiza la interfaz más apropiada, garantizando una experiencia de usuario óptima y profesional en cualquier dispositivo.

-   **Móvil (< 1024px)**: Se activa el **Single Mode**.
-   **Tablet / PC (>= 1024px)**: Se activa el **Studio Mode**.

Este enfoque garantiza que los botones críticos nunca se oculten, la interacción táctil sea siempre cómoda y la disposición de los elementos se ajuste perfectamente a la orientación del dispositivo.

### 8.2. Studio Mode (Tablets y PC)
La interfaz del modo estudio está organizada para un flujo de trabajo de producción eficiente:
-   **Layout Principal**: Una cuadrícula de 3 columnas (Video Control, Audio Control, Panel de Pestañas) que se mantiene en pantallas anchas.
-   **Adaptación a Tablets (Vertical)**: En viewports más estrechos (ej. un iPad en modo retrato), las 3 columnas principales **se apilan verticalmente**, asegurando que ningún control se comprima o sea inutilizable.

### 8.3. Single Mode (Móviles)
-   **Arriba**: Preview de PGM grande con un preview más pequeño de PVW superpuesto.
-   **Medio**: Tira de selección de fuentes (Input Strip).
-   **Abajo (Fijo)**: Barra de control con 7 botones críticos (CUT, AUTO, STREAM, RECORD, MIC LOCK, etc.), siempre al alcance del pulgar.
-   **Panel Deslizable**: Acceso a controles contextuales (Audio, Overlays, Performance) sin saturar la vista principal.

---

## 9. Configuración (JSON y Feature Flags)

ARCLS es configurable mediante un objeto JSON (`config.ts`) que habilita o deshabilita módulos.
*Ejemplo:*
```json
{
  "audioConsole": {
    "enabled": true,
    "mode": "BROADCAST"
  },
  "lighting": {
    "enabled": true
  }
}
```
Si `audioConsole.enabled` es `false`, la UI mostrará un mezclador simplificado, pero el limiter P0 seguirá protegiendo la salida.