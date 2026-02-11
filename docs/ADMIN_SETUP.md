# Configuracion del Primer Administrador

Este documento explica como configurar el primer administrador del sistema y gestionar roles de usuario.

## Roles del Sistema

| Rol | Codigo | Permisos |
|-----|--------|----------|
| **Admin** | 1 | Acceso completo: usuarios, agentes, configuracion, todas las propiedades |
| **Agente** | 2 | Dashboard, leads, propiedades asignadas, perfil |
| **Usuario** | 3 | Dashboard, mis propiedades, nueva propiedad, perfil |

---

## Paso 1: Registrar Cuenta

1. Ir a `https://tu-dominio.com/registro`
2. Crear cuenta con el email del administrador principal
3. Completar el registro normalmente

> **Nota:** Al registrarse, todos los usuarios reciben automaticamente el rol de Usuario (3).

---

## Paso 2: Promover a Administrador

### Opcion A: Via Supabase Dashboard (Recomendado)

1. Ir a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a **SQL Editor** en el menu lateral
4. Ejecutar el siguiente comando:

```sql
UPDATE profiles
SET role = 1
WHERE email = 'admin@tuempresa.com';
```

5. Verificar que el cambio se aplico:

```sql
SELECT id, email, role, is_active
FROM profiles
WHERE email = 'admin@tuempresa.com';
```

### Opcion B: Via Table Editor

1. Ir a **Table Editor** en Supabase Dashboard
2. Seleccionar la tabla `profiles`
3. Buscar el usuario por email
4. Editar el campo `role` y cambiarlo a `1`
5. Guardar cambios

---

## Paso 3: Verificar Acceso

1. Ir a `https://tu-dominio.com/login`
2. Iniciar sesion con las credenciales del admin
3. Navegar a `/admin/usuarios`
4. Deberias ver la lista completa de usuarios

Si puedes ver la pagina de usuarios, la configuracion fue exitosa.

---

## Gestion de Roles desde el Panel

Una vez que eres administrador, puedes gestionar roles de otros usuarios visualmente:

### Cambiar Rol de Usuario

1. Ir a **Usuarios** en el menu lateral izquierdo
2. Buscar el usuario que deseas modificar
3. Hacer clic en el icono de tres puntos (⋮) en la columna "Acciones"
4. Seleccionar **Cambiar rol**
5. Elegir el nuevo rol:
   - **Administrador** - Acceso completo
   - **Agente** - Acceso a leads y propiedades
   - **Usuario** - Acceso basico

### Activar/Desactivar Usuarios

1. Ir a **Usuarios**
2. Hacer clic en ⋮ junto al usuario
3. Seleccionar **Activar** o **Desactivar**

> **Nota:** Los usuarios desactivados no pueden iniciar sesion.

---

## Flujo de Trabajo Recomendado

```
Setup Inicial (una sola vez)
        |
        v
[Owner se registra] --> [Ejecuta UPDATE en Supabase] --> [Owner es Admin]
        |
        v
Gestion Continua
        |
        v
[Admin accede a /admin/usuarios] --> [Gestiona roles visualmente]
```

---

## Permisos por Rol (Referencia)

| Funcionalidad | Usuario | Agente | Admin |
|---------------|:-------:|:------:|:-----:|
| Dashboard | Si | Si | Si |
| Mi Perfil | Si | Si | Si |
| Mis Propiedades | Si | Si | Si |
| Nueva Propiedad | Si | Si | Si |
| Ver todas las Propiedades | No | Si | Si |
| Propiedades Pendientes | No | No | Si |
| Leads | No | Si | Si |
| Gestion de Usuarios | No | No | Si |
| Gestion de Agentes | No | No | Si |
| Configuracion | No | No | Si |

---

## Troubleshooting

### "No tengo acceso a /admin/usuarios"

- Verifica que tu rol sea 1 en la tabla `profiles`
- Ejecuta: `SELECT role FROM profiles WHERE email = 'tu@email.com';`
- Si el rol no es 1, ejecuta el UPDATE de nuevo

### "El usuario no puede iniciar sesion"

- Verifica que `is_active` sea `true` en la tabla `profiles`
- Si es `false`, activalo desde el panel o con:
  ```sql
  UPDATE profiles SET is_active = true WHERE email = 'usuario@email.com';
  ```

### "No encuentro al usuario en la lista"

- El usuario debe haberse registrado primero en `/registro`
- Verifica que exista un registro en la tabla `profiles` para ese email
