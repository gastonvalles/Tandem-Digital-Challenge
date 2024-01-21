<template>
    <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" md="8">
                <div class="container">
                    <v-img src="/Tandem.png" alt="Tandem Logo" class="logo" />
                    <v-form @submit.prevent="login" class="form" v-model="valid" lazy-validation>
                        <v-row>
                            <v-col>
                                <v-subheader class="form-title">Acceder</v-subheader>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="usuario" label="Nombre de usuario" required />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field v-model="contraseña" label="Contraseña" type="password" required />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <v-btn type="submit" class="submit">
                                    Iniciar Sesión
                                    <v-icon right>mdi-arrow-right</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <p class="signup-link">
                                    No tienes cuenta?
                                    <router-link to="/register">Regístrate</router-link>
                                </p>
                            </v-col>
                        </v-row>
                    </v-form>
                    <AlertMessage :errorMessage="errorMensaje" v-if="errorMensaje" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";
import AlertMessage from "./AlertMessage";

export default {
    data() {
        return {
            usuario: "",
            contraseña: "",
            errorMensaje: "",
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post("http://localhost:3000/login", {
                    usuario: this.usuario,
                    contraseña: this.contraseña,
                });

                if (response.status === 201) {
                    sessionStorage.setItem("token", response.data.token);
                    this.$router.replace("/users");
                } else {
                    this.mostrarError("Credenciales incorrectas.");
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.mostrarError("Credenciales incorrectas.");
                } else {
                    this.mostrarError("Error al iniciar sesión");
                }
            }
        },

        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = "";
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

.signup-link {
    color: #6b7280;
    font-size: 0.975rem;
    line-height: 1.25rem;
    text-align: center;
    margin-top: 10px;
}

.signup-link a {
    text-decoration: underline;
}
</style>
