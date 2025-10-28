# 📚 DOCUMENTACIÓN FUNCIONAL
## Intranet Corporativa - Alejandría

---

## 📋 ÍNDICE GENERAL

1. [Introducción](#1-introducción-general)
2. [Acceso al Sistema](#2-acceso-al-sistema)
3. [Roles y Permisos](#3-roles-y-permisos)
4. [Estructura del Sistema](#4-estructura-del-sistema-módulos-principales)
5. [Flujos de Procesos Clave](#5-flujos-de-procesos-clave)
6. [Notificaciones y Mensajes](#6-notificaciones-y-mensajes)
7. [Recuperación de Contraseña](#7-recuperación-de-contraseña)
8. [Errores Comunes](#8-errores-o-incidencias-comunes)
9. [Glosario de Términos](#9-glosario-de-términos)
10. [Anexos](#10-anexos)

---

## 1. INTRODUCCIÓN GENERAL

### 1.1 Descripción del Sistema

La **Intranet Corporativa Alejandría** es una plataforma web interna diseñada para gestionar y coordinar todos los procesos operativos de la organización. El sistema facilita la comunicación y colaboración entre diferentes roles dentro de la empresa, optimizando la gestión de estudiantes, asesores, contratos, pagos y servicios de asesoría académica.

### 1.2 Objetivo de la Documentación

Esta documentación tiene como objetivo proporcionar una guía completa sobre el funcionamiento de la intranet desde la perspectiva del usuario final, detallando las operaciones disponibles en cada módulo según el rol asignado.

### 1.3 Alcance

Esta documentación cubre los siguientes módulos principales:
- Gestión de Usuarios (Estudiantes y Asesores)
- Reuniones y Zoom
- Entregas y Revisiones de Documentos
- Calendarios y Planificación
- Gestión de Pagos y Contratos
- Inducciones y Recursos
- Soporte Técnico
- Configuración del Sistema

---

## 2. ACCESO AL SISTEMA

### 2.1 Requisitos de Acceso

**Requisitos Técnicos:**
- Navegador web actualizado (Chrome, Firefox, Edge, Safari)
- Conexión a Internet estable
- Credenciales de usuario válidas (username y contraseña)

**Credenciales:**
Las credenciales de acceso son proporcionadas por el administrador del sistema según el rol asignado.

### 2.2 URL de Acceso

Para acceder al sistema, ingrese la siguiente dirección en su navegador:
```
https://[dirección-del-servidor]
```

### 2.3 Flujo de Inicio de Sesión

1. **Acceder a la pantalla de Login:**
   - Ingrese a la URL del sistema
   - Se mostrará automáticamente la pantalla de inicio de sesión

2. **Completar credenciales:**
   - En el campo "Nombre de Usuario", ingrese su usuario asignado
   - En el campo "Contraseña", ingrese su contraseña
   - Haga clic en el botón "Iniciar Sesión"

3. **Redirección automática:**
   - El sistema validará las credenciales
   - Si son correctas, será redirigido automáticamente al panel principal según su rol
   - Si las credenciales son incorrectas, aparecerá el mensaje: "Usuario o contraseña incorrecta"

### 2.4 Captura de Pantalla del Login

> **Nota:** La interfaz de login incluye el logo de Alejandría, campos de usuario y contraseña, y un botón de inicio de sesión con diseño moderno.

---

## 3. ROLES Y PERMISOS

El sistema maneja los siguientes roles de usuario, cada uno con permisos específicos:

### Tabla de Roles y Permisos

| Rol | Descripción | Ruta de Acceso | Permisos Principales |
|-----|-------------|----------------|---------------------|
| **Estudiante** | Cliente que recibe asesoría académica | `/estudiante/home` | Ver reuniones, subir documentos, ver pagos, acceder a recursos, solicitar soporte |
| **Asesor** | Profesional que brinda asesoría | `/asesor/home` | Gestionar clientes activos, revisar documentos, crear reuniones Zoom, subir inducciones |
| **Jefe de Operaciones** | Administra usuarios y asignaciones | `/jefe-operaciones/gestionar-usuarios` | Crear/editar estudiantes y asesores, asignar supervisores |
| **Supervisor** | Supervisa asignaciones de asesores | `/supervisor/asignaciones` | Asignar asesores a estudiantes, crear asesorías, auditar actividades |
| **Contrato y Pago** | Gestiona contratos y pagos | `/cont-pago/contratos` | Crear contratos, gestionar pagos (cuotas, al contado, servicios extra) |
| **Marketing** | Configura contenido de la intranet | `/marketing/ConfigIntra` | Configurar contenido promocional, notificaciones, recursos |
| **Soporte TI** | Soporte técnico del sistema | `/soporte-ti` | Resolver incidencias técnicas, gestionar tickets de soporte |

### 3.1 Detalle de Roles

#### Estudiante
- Visualizar reuniones programadas y anteriores
- Subir documentos para revisión
- Ver estado de entregas (terminados/pendientes)
- Consultar calendario de actividades
- Acceder a recursos y materiales de inducción
- Ver estado de pagos
- Solicitar soporte técnico
- Ver y editar perfil personal
- Ver información de su asesor asignado
- Ver contrato asignado
- Cambiar contraseña

#### Asesor
- Visualizar estudiantes asignados (activos/desactivados)
- Gestionar reuniones de Zoom
- Revisar documentos enviados por estudiantes
- Marcar documentos como terminados o pendientes
- Ver calendario personalizado
- Crear y gestionar inducciones
- Ver información de cada estudiante asignado

#### Jefe de Operaciones
- Crear nuevos estudiantes y asesores
- Editar información de usuarios existentes
- Listar estudiantes y asesores
- Asignar supervisores a usuarios
- Activar/desactivar usuarios

#### Supervisor
- Asignar estudiantes a asesores
- Crear nuevas asesorías
- Editar asignaciones existentes
- Ver panel de auditoría de actividades
- Filtrar por área, asesor y cliente

#### Contrato y Pago
- Crear nuevos contratos
- Gestionar contratos asignados
- Administrar pagos por cuotas
- Registrar pagos al contado
- Gestionar servicios extra

#### Marketing
- Configurar contenido de la intranet
- Gestionar recursos promocionales
- Configurar notificaciones del sistema

#### Soporte TI
- Resolver tickets de soporte
- Gestionar incidencias técnicas
- Proporcionar asistencia a usuarios

---

## 4. ESTRUCTURA DEL SISTEMA (MÓDULOS PRINCIPALES)

### 4.1 Módulo de Navegación

**Descripción:** Toda la interfaz utiliza un sistema de navegación lateral (sidebar) que se adapta según el rol del usuario y se puede expandir o contraer.

**Características:**
- Menú lateral colapsable
- Navegación responsiva (adaptada para móviles)
- Indicador visual de la página activa
- Navegación rápida entre módulos

### 4.2 Módulo: Home (Panel Principal)

#### Para Estudiante
- **Ruta:** `/estudiante/home`
- **Descripción:** Pantalla principal que muestra información general, resumen de actividades pendientes, próximas reuniones y noticias relevantes.

#### Para Asesor
- **Ruta:** `/asesor/home`
- **Descripción:** Panel de control del asesor con estadísticas de estudiantes asignados, tareas pendientes y métricas de desempeño.

### 4.3 Módulo: Reuniones / Zoom

#### Para Estudiante
- **Ruta:** `/estudiante/reuniones`
- **Funcionalidad:** Ver enlaces de Zoom, horarios de reuniones, unirse a sesiones programadas.

#### Para Asesor
- **Ruta:** `/asesor/reuniones`
- **Submódulos:**
  - **Próximas Reuniones** (`/asesor/reuniones/proximo`)
  - **Reuniones Anteriores** (`/asesor/reuniones/anteriores`)
- **Funcionalidad:** Crear nuevas reuniones de Zoom, gestionar enlaces, programar sesiones con estudiantes.

**Flujo típico:**
1. Acceder al módulo de reuniones
2. Seleccionar "Crear Reunión" o ver existentes
3. Configurar fecha, hora y enlace de Zoom
4. Guardar la reunión
5. Compartir con estudiantes asignados

### 4.4 Módulo: Entrega/Revisión de Documentos

#### Para Estudiante
- **Ruta:** `/estudiante/entrega`
- **Submódulos:**
  - **Terminados:** Documentos ya revisados y completados
  - **Pendientes:** Documentos en proceso de revisión
- **Funcionalidad:** Subir archivos para revisión, ver estado de documentos enviados, descargar documentos corregidos.

**Tipos de archivos permitidos:**
- Documentos: PDF, DOC, DOCX, TXT, PPT, PPTX, XLS, XLSX
- Imágenes: JPEG, PNG, GIF, WEBP
- Comprimidos: ZIP, RAR, 7Z

**Flujo típico:**
1. Acceder a "Entrega/Revisión"
2. Seleccionar "Pendientes" o "Terminados"
3. Hacer clic en "Enviar Archivo" o "Subir Documento"
4. Completar el asunto del envío
5. Seleccionar uno o varios archivos
6. Enviar para revisión
7. El asesor será notificado automáticamente

#### Para Asesor
- **Ruta:** `/asesor/entrega`
- **Submódulos:**
  - **Terminados:** Documentos que ya fueron revisados
  - **Pendientes:** Documentos que requieren revisión
- **Funcionalidad:** Ver documentos enviados por estudiantes, descargar para revisar, marcar como completado y agregar comentarios.

**Flujo típico:**
1. Acceder a "Entrega/Revisión"
2. Ver lista de documentos pendientes de cada estudiante
3. Descargar y revisar el documento
4. Agregar comentarios o correcciones
5. Marcar como "Terminado" cuando esté completo
6. El estudiante recibirá notificación

### 4.5 Módulo: Calendario

#### Para Estudiante
- **Ruta:** `/estudiante/calendario`
- **Descripción:** Visualización mensual/semanal de actividades, reuniones programadas, fechas de entrega.

#### Para Asesor
- **Ruta:** `/asesor/calendario`
- **Descripción:** Calendario personalizado con reuniones agendadas, fechas de revisiones pendientes, eventos importantes.

### 4.6 Módulo: Recursos

#### Para Estudiante
- **Ruta:** `/estudiante/recursos`
- **Funcionalidad:** Acceso a materiales de estudio, guías, documentos de referencia, vídeos de inducción, recursos compartidos por el asesor.

### 4.7 Módulo: Pagos

#### Para Estudiante
- **Ruta:** `/estudiante/pagos`
- **Funcionalidad:** Ver estado de pagos, consultar historial de transacciones, ver facturas, descargar comprobantes.

#### Para Contrato y Pago
- **Ruta:** `/cont-pago/pagos`
- **Submódulos:**
  - **Cuotas:** Gestión de pagos por cuotas
  - **Al Contado:** Registro de pagos al contado
  - **Servicio Extra:** Gestión de servicios adicionales
- **Funcionalidad:** Registrar pagos, emitir facturas, gestionar planes de pago, generar reportes financieros.

### 4.8 Módulo: Soporte

#### Para Estudiante
- **Ruta:** `/estudiante/soporte`
- **Funcionalidad:** Crear tickets de soporte, ver estado de solicitudes, contactar con soporte técnico, acceder a preguntas frecuentes.

### 4.9 Módulo: Gestionar Clientes (Asesor)

- **Ruta:** `/asesor/gestionarAlumno`
- **Submódulos:**
  - **Activos:** Lista de estudiantes activos asignados
  - **Desactivados:** Lista de estudiantes desactivados
- **Funcionalidad:** Ver perfil de cada estudiante, revisar historial de actividades, gestionar estado de asesoría.

### 4.10 Módulo: Inducciones (Asesor)

- **Ruta:** `/asesor/inducciones`
- **Funcionalidad:** Crear nuevas inducciones, subir vídeos o materiales, gestionar recursos de capacitación.

**Flujo típico:**
1. Ir a "Inducciones"
2. Hacer clic en "Nueva Inducción"
3. Completar título y descripción
4. Subir video o archivos
5. Configurar visibilidad
6. Guardar

### 4.11 Módulo: Gestionar Usuarios (Jefe de Operaciones)

- **Ruta:** `/jefe-operaciones/gestionar-usuarios`
- **Submódulos:**
  - **Listar Estudiantes:** Ver todos los estudiantes registrados
  - **Listar Asesores:** Ver todos los asesores registrados
- **Funcionalidades:**
  - **Crear Usuario:** Agregar nuevos estudiantes o asesores
  - **Editar Usuario:** Modificar información de usuarios existentes
  - **Activar/Desactivar:** Cambiar estado de usuarios

**Flujo para crear estudiante:**
1. Acceder a "Gestionar Usuarios" > "Listar Estudiantes"
2. Hacer clic en "Agregar Estudiante"
3. Completar formulario con datos personales
4. Asignar asesor si corresponde
5. Guardar

### 4.12 Módulo: Asignaciones (Supervisor)

- **Ruta:** `/supervisor/asignaciones`
- **Funcionalidad:** Ver todas las asesorías asignadas, crear nuevas asignaciones, editar asignaciones existentes.

**Flujo para crear asignación:**
1. Acceder a "Asignaciones"
2. Hacer clic en "Nueva Asesoría"
3. Seleccionar estudiante y asesor
4. Configurar parámetros de la asesoría
5. Guardar asignación

### 4.13 Módulo: Contratos (Contrato y Pago)

- **Ruta:** `/cont-pago/contratos`
- **Submódulos:**
  - **Nuevo Contrato:** Crear contratos desde cero
  - **Contrato Asignado:** Ver y gestionar contratos existentes
- **Funcionalidad:** Crear contratos, asignar a estudiantes, gestionar términos y condiciones.

### 4.14 Módulo: Perfil de Usuario

- **Rutas:**
  - **Mi Perfil:** Ver información personal
  - **Editar Perfil:** Modificar datos personales
  - **Mi Asesor:** Ver información del asesor asignado (solo estudiantes)
  - **Mi Contrato:** Ver detalles del contrato (solo estudiantes)
  - **Cambiar Contraseña:** Actualizar contraseña de acceso

---

## 5. FLUJOS DE PROCESOS CLAVE

### 5.1 Flujo de Asignación Estudiante-Asesor

```
Supervisor → Selecciona estudiante → Asigna asesor → Estudiante recibe notificación
```

### 5.2 Flujo de Revisión de Documentos

```
Estudiante sube documento → Asesor recibe notificación → Asesor descarga y revisa 
→ Asesor marca como terminado → Estudiante recibe notificación de completado
```

### 5.3 Flujo de Creación de Reunión Zoom

```
Asesor crea reunión → Configura fecha/hora → Genera enlace Zoom → 
Estudiante recibe notificación → Ambos se reúnen en Zoom
```

### 5.4 Flujo de Gestión de Pagos

```
Contrato y Pago crea contrato → Asigna al estudiante → 
Registra pagos → Genera facturas → Estudiante visualiza estado
```

### 5.5 Flujo de Soporte Técnico

```
Estudiante crea ticket → Soporte TI recibe solicitud → 
Soporte responde/resuelve → Estudiante recibe notificación
```

---

## 6. NOTIFICACIONES Y MENSAJES

El sistema utiliza un sistema de notificaciones en tiempo real para informar a los usuarios sobre eventos importantes.

### Tipos de Notificaciones

1. **Notificaciones de Reuniones:** Alerta cuando hay una reunión próxima
2. **Notificaciones de Documentos:** Informa cuando un documento cambia de estado
3. **Notificaciones de Asignación:** Notifica cuando se asigna un nuevo asesor o estudiante
4. **Notificaciones de Pagos:** Informa sobre actualizaciones en el estado de pagos
5. **Notificaciones de Soporte:** Actualiza sobre el estado de tickets de soporte

### Ubicación de Notificaciones

Las notificaciones aparecen en:
- Icono de campana en la barra superior
- Mensajes emergentes temporales (toast notifications)
- Panel de notificaciones al hacer clic en el ícono

---

## 7. RECUPERACIÓN DE CONTRASEÑA

### Proceso de Recuperación

1. **Acceder a recuperación:**
   - En la pantalla de login, hacer clic en "¿Olvidaste tu contraseña?"

2. **Ingresar correo o usuario:**
   - Introducir el correo electrónico o nombre de usuario registrado
   - Hacer clic en "Enviar"

3. **Recibir enlace:**
   - El sistema enviará un enlace de recuperación al correo electrónico registrado

4. **Restablecer contraseña:**
   - Hacer clic en el enlace recibido
   - Ingresar la nueva contraseña
   - Confirmar la nueva contraseña
   - Guardar cambios

**Ruta:** `/recuperarContraseña` → `/cambiarContraseña/[token]`

---

## 8. ERRORES O INCIDENCIAS COMUNES

### 8.1 Problemas de Acceso

**Error:** "Usuario o contraseña incorrecta"
- **Solución:** Verificar que las credenciales sean correctas, asegurarse de que no haya mayúsculas/minúsculas incorrectas

**Error:** "Sesión expirada"
- **Solución:** Cerrar sesión y volver a iniciar sesión

**Error:** "No tienes permiso para acceder a esta página"
- **Solución:** Contactar con el administrador para verificar los permisos de tu rol

### 8.2 Problemas de Carga

**Problema:** La página no carga
- **Solución:** 
  - Verificar conexión a Internet
  - Limpiar caché del navegador
  - Intentar con otro navegador
  - Contactar a Soporte TI

**Problema:** Los archivos no se suben
- **Solución:**
  - Verificar que el archivo cumpla con los formatos permitidos
  - Verificar que el tamaño del archivo no exceda el límite
  - Intentar con otro archivo

### 8.3 Contacto para Incidencias

Para reportar problemas técnicos o solicitar asistencia:

- **Módulo de Soporte:** Acceder a `/estudiante/soporte` o `/soporte-ti`
- **Crear ticket:** Llenar el formulario de soporte con la descripción del problema
- **Esperar respuesta:** El equipo de soporte responderá en un plazo de 24-48 horas

---

## 9. GLOSARIO DE TÉRMINOS

| Término | Definición |
|---------|-----------|
| **Asesor** | Profesional que brinda asesoría académica a estudiantes |
| **Asignación** | Vínculo entre un estudiante y su asesor asignado |
| **Contrato** | Documento que establece los términos del servicio |
| **Estudiante** | Cliente que recibe asesoría académica |
| **Entrega/Revisión** | Proceso de envío y corrección de documentos |
| **Inducción** | Material de capacitación o formación inicial |
| **Reunión Zoom** | Sesión virtual de videoconferencia entre asesor y estudiante |
| **Ticket** | Solicitud de soporte técnico en el sistema |
| **Supervisor** | Usuario que gestiona asignaciones entre asesores y estudiantes |
| **Jefe de Operaciones** | Usuario con permisos administrativos para gestionar usuarios |

---

## 10. ANEXOS

### 10.1 Requisitos del Sistema

- **Navegador recomendado:** Google Chrome, Mozilla Firefox, Microsoft Edge
- **Resolución mínima:** 1366x768
- **Conexión a Internet:** Estable

### 10.2 Enlaces Útiles

- URL del sistema: [Configurar según el entorno]
- Centro de ayuda: [URL de documentación adicional]
- Soporte técnico: [Email o formulario de contacto]

### 10.3 Manual de Usuario Rápido

**Para Estudiantes:**
1. Iniciar sesión con tus credenciales
2. Revisar el panel principal para ver actividades pendientes
3. Subir documentos en "Entrega/Revisión"
4. Ver reuniones programadas en "Reuniones"
5. Consultar pagos en el módulo "Pagos"

**Para Asesores:**
1. Iniciar sesión
2. Revisar documentos pendientes en "Entrega/Revisión"
3. Crear reuniones en "Reuniones"
4. Gestionar estudiantes asignados en "Gestionar Clientes"
5. Subir recursos de inducción

**Para Administradores:**
1. Gestionar usuarios en "Gestionar Usuarios"
2. Ver y asignar contratos
3. Configurar parámetros del sistema según el rol

### 10.4 Video Tutoriales

> **Nota:** Los videos tutoriales estarán disponibles en el módulo de Recursos o mediante enlaces proporcionados por el administrador.

### 10.5 Versión del Documento

- **Versión:** 1.0
- **Fecha de actualización:** [Fecha actual]
- **Autor:** Equipo de Desarrollo Alejandría

---

## 📞 CONTACTO Y SOPORTE

Para cualquier consulta, incidencia o sugerencia:

- **Soporte Técnico:** Acceder al módulo de Soporte dentro de la intranet
- **Email de soporte:** [configurar según el caso]
- **Horario de atención:** [configurar según el caso]

---

**© 2024 Intranet Alejandría - Todos los derechos reservados**
