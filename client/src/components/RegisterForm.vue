<template>
    <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" md="8">
                <div class="container">
                    <v-img src="/Tandem.png" alt="Tandem Logo" class="logo" />
                    <v-form @submit.prevent="register" class="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col>
                                <h2 class="form-title">Crea tu cuenta en Tándem Digital</h2>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="usuario.nombre" label="Nombre" required />
                                <v-text-field v-model="usuario.apellido" label="Apellido" required />
                                <v-text-field v-model="usuario.email" :rules="emailRules" label="Email" required />
                                <v-text-field v-model="usuario.telefono" label="Teléfono" required />
                                <v-text-field v-model="usuario.usuario" label="Nombre de usuario" required />
                                <v-text-field v-model="usuario.contraseña" label="Contraseña" type="password" required />
                                <v-text-field v-model="usuario.confirmarContraseña" label="Confirmar contraseña"
                                    type="password" required />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <!-- Botón para volver atrás -->
                                <v-btn @click="goBack" class="goBack">
                                    <v-icon right>mdi-arrow-left</v-icon>
                                    Volver
                                </v-btn>
                            </v-col>
                            <v-col>
                                <!-- Botón para enviar el formulario -->
                                <v-btn type="submit" class="submit">
                                    Registrarse
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <!-- Mensaje para indicar que el usuario se creó exitosamente-->
                    <v-alert v-if="registroExitoso" type="success" style="position: fixed; top: 20px; right: 20px">
                        Usuario creado exitosamente
                    </v-alert>
                    <!-- Componente de alerta para mostrar mensajes de error -->
                    <v-alert v-if="errorMensaje" type="error" style="position: fixed; top: 20px; right: 20px">
                        {{ errorMensaje }}
                    </v-alert>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import useApi from '../util/HTTPrequest.js';

export default {
    // Datos locales del componente
    data() {
        return {
            usuario: {
                nombre: "",
                apellido: "",
                email: "",
                telefono: "",
                usuario: "",
                contraseña: "",
                confirmarContraseña: "",
            },
            registroExitoso: false,
            errorMensaje: "",
            emailRules: [
                v => !!v || 'E-mail requerido',
                v => /.+@.+\..+/.test(v) || 'El E-mail debe ser válido',
            ],
        };
    },
    // Métodos del componente
    methods: {
        // Función para manejar el registro de un nuevo usuario
        async register() {
            if (this.usuario.contraseña !== this.usuario.confirmarContraseña) {
                this.mostrarError('Las contraseñas no coinciden');
                return;
            }

            if (Object.values(this.usuario).some(value => value === '')) {
                this.mostrarError('Por favor llene todos los campos');
                return;
            }

            try {
                // Obtiene la función post de la API utilizando useApi
                const { post } = useApi();

                // Realiza una solicitud POST para registrar un nuevo usuario
                const response = await post("/users", this.usuario);

                // Verifica el estado de la respuesta
                if (response.status === 200) {
                    this.registroExitoso = true;

                    this.ocultarAlertaRegistro();

                    // Redirige al usuario a la página de inicio de sesión
                    setTimeout(() => {
                        this.$router.push("/");
                    }, 2000);
                } else {
                    // Muestra un mensaje de error si hay un problema con el registro
                    this.mostrarError("Error al registrar el usuario.");
                }
            } catch (error) {
                // Manejo de errores, muestra mensajes de error según la respuesta
                if (error.response && error.response.status === 409) {
                    this.mostrarError("El nombre de usuario o correo electrónico ya está en uso.");
                } else {
                    this.mostrarError("Error al registrar el usuario. Inténtalo de nuevo.");
                }
            }
        },
        // Muestra un mensaje de error durante un período de tiempo
        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = "";
            }, 4000);
        },
        // Vuelve atrás en la navegación utilizando el router
        goBack() {
            this.$router.go(-1);
        },
        // Oculta la alerta de registro después de un tiempo
        ocultarAlertaRegistro() {
            setTimeout(() => {
                this.registroExitoso = false;
            }, 4000);
        },
    },
};
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    padding: 2rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 2rem;
    margin: auto;
}

.logo {
    width: 250px;
    margin-bottom: 20px;
}

.form {
    width: 100%;
    margin: auto;
}

.form-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 400;
    color: #000;
}

.submit {
    background-color: #1a73e8;
    color: #fff;
    width: 100%;
    text-transform: uppercase;
}

.goBack {
    background-color: grey;
    color: #fff;
    width: 100%;
    text-transform: uppercase;
}

.error-alert-container {
    position: fixed;
    top: 0;
    right: 0;
    margin-top: 20px;
    margin-right: 20px;
}
</style>
