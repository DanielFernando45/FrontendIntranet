// src/routes/RouterApp.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';

// Páginas Estudiante
import HomeEstudiante from '../pages/Estudiante/HomeEstudiante';
import ReunionesEstudiante from '../pages/Estudiante/ReunionesEstudiante';
import EntregaRevisionEst from '../pages/Estudiante/EntregaRevisionEst';
import CalendarioEstudiante from '../pages/Estudiante/CalendarioEstudiante';
import RecursosEstudiante from '../pages/Estudiante/RecursosEstudiante';
import PagosEstudiante from '../pages/Estudiante/PagosEstudiante';
import Soporte from '../pages/Estudiante/SoporteEstudiante';
import MiPerfil from '../pages/Estudiante/Perfil/MiPerfil';
import MiAsesor from '../pages/Estudiante/Perfil/MiAsesor';
import MiContrato from '../pages/Estudiante/Perfil/MiContrato';
import CambiarContraseña from '../pages/Estudiante/Perfil/CambiarContraseña';
import MiPerfilEdit from '../pages/Estudiante/Perfil/MiPerfilEdit';
import Terminados from '../pages/Estudiante/EntregasEnvio/Terminados';
import Pendientes from '../pages/Estudiante/EntregasEnvio/Pendientes';

//Paginas Asesor
import HomeAsesor from '../pages/Asesor/HomeAsesor';
import Reuniones from '../pages/Asesor/ReunionesAsesor';
import EntregaRev from '../pages/Asesor/EntregaRevisionAse';
import DocPendientes from '../pages/Asesor/EnviosCliente/DocPendientes';
import DocTerminado from '../pages/Asesor/EnviosCliente/DocTerminado';
import Calendario from '../pages/Asesor/CalendarioAsesor';
import GestionarAlum from '../pages/Asesor/GestionarAsesor';
import Activos from '../pages/Asesor/GestionAlumActivos/Activos';
import Desactivados from '../pages/Asesor/GestionAlumActivos/Desactivados';
import Proximos from '../pages/Asesor/Reunion/ReunionProximo';
import Anteriores from '../pages/Asesor/Reunion/ReunionAnteriores';
import Induccion from '../pages/Asesor/Inducciones';
import InduccionById from '../pages/Asesor/Induccion/InduccionById';
//Paginas Admin
import GestionarUsuarios from '../pages/Administrador/GestionUser';
import Asignaciones from '../pages/Administrador/Asignaciones';
import Pagos from '../pages/Administrador/Pagos';
import AlContado from '../pages/Administrador/Pagos/AlContado';
import ServiciosExtra from '../pages/Administrador/Pagos/ServiciosExtra';
import Cuotas from '../pages/Administrador/Pagos/Cuotas';
import EditarAsignacion from '../pages/Administrador/Asignaciones/EditarAsignado'
import AgregarEstudiante from '../pages/Administrador/GestionarUsuario/AgregarEstudiante';
import AgregarAsesor from '../pages/Administrador/GestionarUsuario/AgregarAsesor';
import EditarEstudiante from '../pages/Administrador/GestionarUsuario/EditarEstudiante';
import EditarAsesor from '../pages/Administrador/GestionarUsuario/EditarAsesor';
import ListarSinAsignar from '../pages/Administrador/Asignaciones/ListarSinAsignar';
import ListarAsignado from '../pages/Administrador/Asignaciones/ListarAsignados';
import AsesoriaNueva from '../pages/Administrador/Asignaciones/AsesoriaNueva';
import GestionarSoporte from '../pages/Administrador/GestionSoporte';
import ConfigIntra from '../pages/Administrador/ConfigIntra';


//Rutas Jefe Operaciones
import JefeOperaciones from '../pages/JefeOperacion/GestionUser';
import ListarEstudiante from '../pages/JefeOperacion/GestionarUsuario/ListarEstudiante';
import ListarAsesor from '../pages/JefeOperacion/GestionarUsuario/ListarAsesor';
import JefeOpeAsignar from '../pages/JefeOperacion/JefeOpeAsignar';

//Rutas Supervisor
import SupervisorAsig from '../pages/Supervisor/Asignacion';
import NuevaAsesoria from '../pages/Supervisor/SupervisorAsignar/NuevaAsesoria';
import EditAsig from '../pages/Supervisor/SupervisorAsignar/EditAsig';

//Rutas ContratoYpago
import Contrato from '../pages/ContPago/Contrato';
import ContratoAsignado from '../pages/ContPago/Contrato/ContratoAsignado';
import ContratoNuevo from '../pages/ContPago/Contrato/ContratoNuevo';
import Pago from '../pages/ContPago/Pagos';
import Cuota from '../pages/ContPago/Pagos/Cuotas';
import Contado from '../pages/ContPago/Pagos/AlContado';
import ServExtra from '../pages/ContPago/Pagos/ServiciosExtra';

//Ruta Marketing
import MarketingConf from '../pages/Marketing/ConfIntranet';

//Ruta Soporte TI
import SoporteTI from '../pages/SoporteTi/Soporte';

//Paginas Errores
import Unauthorized from '../pages/Unauthorized';
import ErrorScreen from '../pages/ErrorScreen';

//Pagina Recuperar Contraseña
import ResetPassword from '../pages/ResetPassword';
import NuevaContraseña from '../pages/NuevaContraseña';


const RouterApp = () => {
  return (
    <Routes>

      {/* RUTAS ESTUDIANTE */}
      <Route element={<ProtectedRoutes allowedRoles={['estudiante']} />}>
        <Route path="/estudiante/home" element={<HomeEstudiante />} />
        <Route path="/estudiante/reuniones" element={<ReunionesEstudiante />} />

        <Route path="/estudiante/entrega" element={<EntregaRevisionEst />} >
          <Route index element={<Navigate to="terminados" replace />} />
          <Route path="terminados" element={<Terminados />} />
          <Route path="pendientes" element={<Pendientes />} />
          <Route />
        </Route>

        <Route path="/estudiante/calendario" element={<CalendarioEstudiante />} />
        <Route path="/estudiante/recursos" element={<RecursosEstudiante />} />
        <Route path="/estudiante/pagos" element={<PagosEstudiante />} />
        <Route path="/estudiante/soporte" element={<Soporte />} />
        <Route path="/estudiante/miperfil" element={<MiPerfil />} />
        <Route path="/estudiante/miperfiledit" element={<MiPerfilEdit />} />
        <Route path="/estudiante/miasesor" element={<MiAsesor />} />
        <Route path="/estudiante/micontrato" element={<MiContrato />} />
        <Route path="/estudiante/cambiarcontraseña" element={<CambiarContraseña />} />

      </Route>


      {/* RUTAS ASESOR */}
      <Route element={<ProtectedRoutes allowedRoles={['asesor']} />}>
        <Route path="/asesor/home" element={<HomeAsesor />} />

        <Route path="/asesor/reuniones" element={<Reuniones />}>
          <Route index element={<Navigate to="proximo" replace />} />
          <Route path="proximo" element={<Proximos />} />
          <Route path="anteriores" element={<Anteriores />} />
        </Route>

        <Route path="/asesor/entrega" element={<EntregaRev />}>
          <Route index element={<Navigate to="terminados" replace />} />
          <Route path="terminados" element={<DocTerminado />} />
          <Route path="pendientes" element={<DocPendientes />} />
        </Route>


        <Route path="/asesor/calendario" element={<Calendario />} />

        <Route path="/asesor/gestionarAlumno" element={<GestionarAlum />}>
          <Route index element={<Navigate to="activos" replace />} />
          <Route path="activos" element={<Activos />} />
          <Route path="desactivados" element={<Desactivados />} />
        </Route>

        <Route path="/asesor/inducciones" element={<Induccion />} />
        <Route path="/asesor/induccion/:id" element={<InduccionById />} />

      </Route>

      {/* RUTAS ADMIN */}
      <Route element={<ProtectedRoutes allowedRoles={['admin']} />}>

        <Route path="/admin/gestionar-usuarios" element={<GestionarUsuarios />}>
          <Route index element={<Navigate to="listar-estudiantes" replace />} />
          <Route path="listar-estudiantes" element={<ListarEstudiante />} />
          <Route path="listar-asesores" element={<ListarAsesor />} />
        </Route>

        <Route path="/admin/asignaciones" element={<Asignaciones />}>
          <Route index element={<Navigate to="listar-asignar" replace />} />
          <Route path="listar-asignar" element={<ListarSinAsignar />} />
          <Route path="listar-asignado" element={<ListarAsignado />} />
        </Route>

        <Route path="/admin/asignaciones/asesoria-nueva" element={<AsesoriaNueva />} />
        <Route path="/admin/asignaciones/editar-asesoria/:id" element={<EditarAsignacion />} />

        <Route path="/admin/gestionar-usuarios/agregar-estudiante" element={<AgregarEstudiante />} />
        <Route path="/admin/gestionar-usuarios/agregar-asesor" element={<AgregarAsesor />} />
        <Route path="/admin/gestionar-usuarios/editar-estudiante/:id" element={<EditarEstudiante />} />
        <Route path="/admin/gestionar-usuarios/editar-asesor/:id" element={<EditarAsesor />} />

        <Route path="/admin/pagos" element={<Pagos />}>
          <Route index element={<Navigate to="cuotas" replace />} />
          <Route path="cuotas" element={<Cuotas />} />
          <Route path="al-contado" element={<AlContado />} />
          <Route path="servicio-extra" element={<ServiciosExtra />} />
        </Route>

        <Route path="/admin/confIntra" element={<ConfigIntra />} />
        <Route path="/admin/soporte" element={<GestionarSoporte />} />

      </Route>

      {/* RUTAS JEFE OPERACIONES  */}
      <Route element={<ProtectedRoutes allowedRoles={['jefe_operaciones']} />}>
        <Route path="/jefe-operaciones/gestionar-usuarios" element={<JefeOperaciones />}>
          <Route index element={<Navigate to="listar-estudiantes" replace />} />
          <Route path="listar-estudiantes" element={<ListarEstudiante />} />
          <Route path="listar-asesores" element={<ListarAsesor />} />
        </Route>
        <Route path="/jefe-operaciones/supervisor-asig" element={<JefeOpeAsignar />} />
      </Route>

      {/* RUTAS SUPERVISOR  */}
      <Route element={<ProtectedRoutes allowedRoles={['supervisor']} />}>
        <Route path="/supervisor/asignaciones" element={<SupervisorAsig />} />
        <Route path="/supervisor/contrato/nueva-asesoria" element={<NuevaAsesoria />} />
        <Route path="/supervisor/contrato/edit-asig/:id" element={<EditAsig />} />
      </Route>

      {/* RUTAS CONTRATO PAGO  */}
      <Route element={<ProtectedRoutes allowedRoles={['contrato_pago']} />}>

        <Route path="/cont-pago/contratos" element={<Contrato />}>
          <Route path="nuevo_contrato" element={<ContratoNuevo />} />
          <Route path="contrato_asignado" element={<ContratoAsignado />} />
        </Route>

        <Route path="/cont-pago/pagos" element={<Pago />}>
          <Route index element={<Navigate to="cuotas" replace />} />
          <Route path="cuotas" element={<Cuota />} />
          <Route path="al-contado" element={<Contado />} />
          <Route path="servicio-extra" element={<ServExtra />} />
        </Route>

      </Route>


      {/* RUTAS MODULO DE MARKETING  */}
      <Route element={<ProtectedRoutes allowedRoles={['marketing']} />}>
        <Route path="/marketing/ConfigIntra" element={<MarketingConf />} />
      </Route>


      {/* RUTAS SOPORTE TI  */}
      <Route element={<ProtectedRoutes allowedRoles={['soporte']} />}>
        <Route path="/soporte-ti" element={<SoporteTI />} />
      </Route>

      {/* RUTA NO AUTORIZADA */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* CATCH ALL */}
      <Route path="*" element={<ErrorScreen />} />

      {/* RECUPERAR CONTRASEÑA */}
      <Route path="/recuperarContraseña" element={<ResetPassword />} />
      <Route path='/cambiarContraseña/:token' element={<NuevaContraseña />} />
    </Routes>
  );
};

export default RouterApp;
