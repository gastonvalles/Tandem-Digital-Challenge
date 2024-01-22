<template>
    <!-- Contenedor principal -->
    <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" md="12">
                <div class="container">
                    <!-- Logo de la aplicación -->
                    <v-img src="/Tandem.png" alt="Tandem Logo" class="logo" />
                    <!-- Título de la lista de usuarios -->
                    <h2 class="text-center mb-15 v-display-2 font-weight-bold teal--text darken-2 mt-5">Lista de Usuarios
                    </h2>
                    <!-- Mensaje de error -->
                    <v-alert v-if="errorMensaje" type="error" style="position: fixed; top: 20px; right: 20px">
                        {{ errorMensaje }}
                    </v-alert>
                    <!-- Barra de búsqueda y diálogo de usuario -->
                    <v-data-table :headers="headers" :items="users" class="elevation-1" :search="search">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-row>
                                    <v-col xs="6" md="6" sm="6">
                                        <!-- Campo de búsqueda -->
                                        <v-text-field v-model="search" color="#009688" append-icon="mdi-magnify"
                                            label="Search" single-line hide-details></v-text-field>
                                    </v-col>
                                </v-row>
                                <!-- Diálogo para editar o crear usuario -->
                                <user-dialog :formTitle="formTitle" :editedItem="editedItem" :dialog="dialog" :users="users"
                                    :editedIndex="editedIndex" :errorMensaje="errorMensaje" @edit-user="editItem"
                                    @save-user="save" @close-dialog="close" @delete-user="deleteUser"></user-dialog>
                            </v-toolbar>
                        </template>
                        <!-- Acciones personalizadas para cada fila -->
                        <template v-slot:[`item.actions`]="{ item }">
                            <!-- Iconos para editar y eliminar usuario -->
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="deleteUser(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                    <!-- Botón para cerrar sesión -->
                    <div class="text-center mt-5">
                        <v-btn color="red" dark @click="logout">Cerrar Sesión</v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
// Importa axios y el componente UserDialog
import axios from 'axios';
import UserDialog from './UserDialog.vue';
// Importa la función useApi del módulo HTTPrequest.js
import useApi from '../util/HTTPrequest.js';

export default {
    // Componentes utilizados
    components: {
        UserDialog,
    },
    // Datos locales del componente
    data: () => ({
        search: '', // Término de búsqueda
        dialog: false, // Estado del diálogo
        headers: [
            { text: 'Nombre', align: 'start', sortable: false, value: 'nombre' },
            { text: 'Apellido', value: 'apellido' },
            { text: 'Email', value: 'email' },
            { text: 'Teléfono', value: 'telefono' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        users: [], // Lista de usuarios
        editedIndex: -1, // Índice del usuario editado
        editedItem: { // Usuario editado
            id: 0,
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            usuario: '',
            contraseña: '',
            contraseñaOriginal: '',
        },
        errorMensaje: '', // Mensaje de error
    }),

    // Propiedades computadas
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
        },
    },

    // Observadores
    watch: {
        dialog(val) {
            val || this.close();
        },
    },

    // Ciclo de vida del componente
    created() {
        this.initialize();
    },

    // Métodos del componente
    methods: {
        // Función para obtener la lista de usuarios desde el servidor
        async fetchUsuarios() {
            const { get } = useApi();

            try {
                const response = await get('/users');
                return response.data;
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        },

        // Inicializa la lista de usuarios
        async initialize() {
            this.users = await this.fetchUsuarios();
        },

        // Edita un usuario
        async editItem(item) {
            const { put } = useApi();
            try {
                const response = await put(`/users/${item.id}`, this.editedItem, {
                    headers: {
                        Authorization: sessionStorage.getItem('accessToken'),
                    },
                });
                // Manejar la respuesta según sea necesario
                console.log('Usuario editado exitosamente:', response.data);
                this.initialize();
                this.close();
            } catch (error) {
                console.error('Error al editar el usuario:', error);
            }
        },

        // Confirmación de eliminación de usuario
        async deleteUser(item) {
            const { del } = useApi();
            try {
                const accessToken = sessionStorage.getItem('accessToken');
                console.log('Token de acceso:', accessToken);
                await del(`http://localhost:3000/users/${item.id}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                    },
                });
                this.initialize();
                this.closeDelete();
            } catch (error) {
                console.error('Error al borrar el usuario:', error);
            }
        },

        // Cierra el diálogo de edición o creación de usuario
        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        // Cierra el diálogo de eliminación de usuario
        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        // Guarda los cambios en un usuario
        async save() {
            if (this.editedItem.usuario.length > 0) {
                try {
                    if (this.editedIndex === -1) {
                        // Si es un nuevo usuario, realiza una solicitud POST
                        await axios.post('http://localhost:3000/users', this.editedItem, {
                            headers: {
                                Authorization: sessionStorage.getItem('token'),
                            },
                        });
                    } else {
                        // Si es un usuario existente, realiza una solicitud PUT
                        await axios.put(`http://localhost:3000/users/${this.editedItem.id}`, this.editedItem, {
                            headers: {
                                Authorization: sessionStorage.getItem('token'),
                            },
                        });
                    }
                    // Actualiza la lista de usuarios y cierra el diálogo
                    this.initialize();
                    this.close();
                } catch (error) {
                    // Manejo de errores, muestra mensajes de error según la respuesta
                    const email = /.+@.+\..+/.test(this.editedItem.email);
                    if (!email) {
                        this.mostrarError('El correo ingresado es inválido');
                        return;
                    }
                    const telefono = this.editedItem.telefono;
                    if (
                        (typeof this.editedItem.telefono !== 'number' && !(/^\+?\d+$/.test(telefono))) ||
                        ((telefono.startsWith('+') && telefono.length < 14) || (!telefono.startsWith('+') && telefono.length > 10 || telefono.length < 9))
                    ) {
                        this.mostrarError('Número de teléfono inválido');
                        return;
                    }
                    const existingUser = this.users.find(user => user.usuario === this.editedItem.usuario);
                    if (existingUser) {
                        this.mostrarError('Este nombre de usuario ya se encuentra en uso');
                        return;
                    }
                }
            }
        },

        // Muestra mensajes de error y los oculta después de un tiempo
        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = '';
            }, 4000);
        },

        // Cierra la sesión del usuario
        async logout() {
            try {
                await axios.post('http://localhost:3000/logout', null, {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                sessionStorage.removeItem('token');
                // Redirige al usuario a la página de inicio
                this.$router.push('/');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        },
    },
};
</script>

<!-- Estilos específicos del componente -->
<style>
.container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 2rem;
    margin: auto;
}

.logo {
    width: 250px;
    margin-bottom: 20px;
}

.v-data-table-header {
    background-color: #009688;
}

.v-data-table-header>tr>th>span {
    color: white;
    font-size: 1rem;
}

.v-data-table-header>tr>th>i {
    display: none !important;
}
</style>
