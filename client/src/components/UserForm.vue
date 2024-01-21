<template>
    <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" md="8">
                <div class="container">
                    <v-img src="/Tandem.png" alt="Tandem Logo" class="logo" />
                    <v-form @submit.prevent="register" class="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col>
                                <v-subheader class="form-title">Creá tu cuenta en Tándem Digital</v-subheader>
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
                                <v-btn @click="goBack" class="goBack">
                                    <v-icon right>mdi-arrow-left</v-icon>
                                    Volver
                                </v-btn>
                            </v-col>
                            <v-col>
                                <v-btn type="submit" class="submit">Registrarse</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-alert v-if="registroExitoso" type="success" style="position: fixed; top: 20px; right: 20px">
                        Usuario creado exitosamente
                    </v-alert>
                    <AlertMessage :errorMessage="errorMensaje" v-if="errorMensaje" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import AlertMessage from "./AlertMessage.vue";

export default {
    data() {
        return {
            usuario: {
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                usuario: '',
                contraseña: '',
                confirmarContraseña: '',
            },
            registroExitoso: false,
            errorMensaje: '',
            emailRules: [
                v => !!v || 'E-mail requerido',
                v => /.+@.+\..+/.test(v) || 'El E-mail debe ser valido',
            ],
        };
    },
    methods: {
        async register() {
            if (this.usuario.contraseña !== this.usuario.confirmarContraseña) {
                this.mostrarError('Las contraseñas no coinciden');
                return;
            }

            if (Object.values(this.usuario).some(value => value === '')) {
                this.mostrarError('Por favor llene todos los campos');
                return;
            }

            if (!this.$v.email.$pending && !this.$v.email.email) {
                this.mostrarError('El correo ingresado es inválido');
                return;
            }

            try {
                await axios.post('http://localhost:3000/register', this.usuario);

                this.registroExitoso = true;

                this.ocultarAlertaRegistro();

                setTimeout(() => {
                    this.$router.push('/login');
                }, 4000);

            } catch (error) {
                this.mostrarError(error.response?.data || 'Error durante el registro');
                console.error('Error al registrar usuario:', error);
            }
        },
        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = '';
            }, 4000);
        },
        goBack() {
            this.$router.go(-1);
        },
        ocultarAlertaRegistro() {
            setTimeout(() => {
                this.registroExitoso = false;
            }, 4000);
        },
    },
    components: {
        AlertMessage,
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
    color: #1a73e8;
}
</style>