<template>
    <v-container class="fill-height" fluid>
        <v-row class="fill-height" justify="center" align="center">
            <v-col cols="12" md="12">
                <div class="container">
                    <v-img src="/Tandem.png" alt="Tandem Logo" class="logo" />
                    <h2 class="text-center mb-15 v-display-2 font-weight-bold teal--text darken-2 mt-5">Lista de Usuarios
                    </h2>
                    <v-alert v-if="errorMensaje" type="error" style="position: fixed; top: 20px; right: 20px">
                        {{ errorMensaje }}
                    </v-alert>
                    <v-toolbar flat>
                        <v-row>
                            <v-col xs="6" md="6" sm="6">
                                <v-text-field v-model="search" color="#009688" append-icon="mdi-magnify" label="Search"
                                    single-line hide-details></v-text-field>
                            </v-col>
                            <v-col xs="6" md="6" sm="6" class="text-right">
                                <v-btn color="primary" @click="createNewUser">Nuevo Usuario</v-btn>
                            </v-col>
                        </v-row>
                    </v-toolbar>
                    <v-dialog v-model="dialogDelete" max-width="600px">
                        <v-card>
                            <v-card-title class="text-h5">¿Estás seguro que quieres eliminar este usuario?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="deleteItemConfirm(editedItem)">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-data-table :headers="headers" :items="users" class="elevation-1" :search="search">
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small @click.stop="toggleEdit(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click.stop="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                    <div class="text-center mt-5">
                        <v-btn color="red" dark @click="logout">Cerrar Sesión</v-btn>
                    </div>
                    <v-dialog v-model="dialog" max-width="600px">
                        <v-card>
                            <v-card-title class="text-h5">{{ formTitle }}</v-card-title>
                            <v-card-text>
                                <v-form @submit.prevent="save">
                                    <v-text-field v-model="editedItem.id" label="ID" disabled></v-text-field>
                                    <v-text-field v-model="editedItem.nombre" label="Nombre"></v-text-field>
                                    <v-text-field v-model="editedItem.apellido" label="Apellido"></v-text-field>
                                    <v-text-field v-model="editedItem.email" label="Email"></v-text-field>
                                    <v-text-field v-model="editedItem.telefono" label="Teléfono"></v-text-field>
                                    <v-text-field v-model="editedItem.usuario" label="Usuario"></v-text-field>
                                    <v-text-field v-model="editedItem.contraseña" label="Contraseña"
                                        type="password"></v-text-field>
                                    <v-btn type="submit" color="primary">{{ isEditing ? 'Guardar' : 'Crear' }}</v-btn>
                                </v-form>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import useApi from '../utils/helper.js';

export default {
    data: () => ({
        search: '',
        dialog: false,
        dialogDelete: false,
        headers: [
            { text: 'Nombre', align: 'start', sortable: false, value: 'nombre' },
            { text: 'Apellido', value: 'apellido' },
            { text: 'Email', value: 'email' },
            { text: 'Teléfono', value: 'telefono' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        users: [],
        editedIndex: -1,
        editedItem: {
            id: 0,
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            usuario: '',
            contraseña: '',
            contraseñaOriginal: '',
        },
        defaultItem: {
            id: 0,
            nombre: '',
            apellido: '',
            email: '',
            telefono: '',
            usuario: '',
            contraseña: '',
        },
        errorMensaje: '',
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        isEditing: false,
    }),

    computed: {
        formTitle() {
            return this.isEditing ? 'Editar Usuario' : 'Nuevo Usuario';
        },
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },

    created() {
        this.initialize();
    },

    methods: {
        async getUsers() {
            const { get } = useApi();
            try {
                const response = await get('/users');
                return response.data;
            } catch (error) {
                console.error('Error al obtener usuarios en getUsers:', error);
                throw error;
            }
        },

        async initialize() {
            this.users = await this.getUsers();
        },

        editItem(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.isEditing = true;
            this.dialog = true;
        },

        toggleEdit(item) {
            this.editItem(item);
        },

        deleteItem(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async deleteItemConfirm(item) {
            const { del } = useApi();
            try {
                await del(`/users/${item.id}`);
                await this.initialize();
                this.closeDelete();
            } catch (error) {
                console.error('Error al borrar el usuario:', error);
            }
        },

        close() {
            this.dialog = false;
            this.isEditing = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        closeDelete() {
            this.dialogDelete = false;
            this.isEditing = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        async save() {
            const { post, put } = useApi();

            try {
                // Validación de campos esenciales
                if (
                    this.editedItem.usuario.length === 0 ||
                    !this.editedItem.nombre ||
                    !this.editedItem.apellido ||
                    !this.editedItem.email ||
                    !this.editedItem.telefono ||
                    !this.editedItem.contraseña
                ) {
                    return;
                }

                const url = this.editedIndex === -1 ? '/users' : `/users/${this.editedItem.id}`;
                await (this.editedIndex === -1 ? post(url, this.editedItem) : put(url, this.editedItem));

                await this.initialize();
                this.close();
            } catch (error) {
                console.error("Error en la función save de UserList:", error);

                if (error.response) {
                    // Error de respuesta HTTP, puedes acceder a error.response para obtener más detalles
                    console.error("Respuesta HTTP:", error.response);
                } else if (error.request) {
                    // Error de solicitud, puedes acceder a error.request para obtener más detalles
                    console.error("Solicitud HTTP:", error.request);
                } else {
                    // Otro tipo de error
                    console.error("Error desconocido:", error.message);
                }

                throw error;
            }
        },

        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = '';
            }, 4000);
        },

        async logout() {
            const { post } = useApi();
            try {
                await post('/logout');
                sessionStorage.removeItem('accessToken');
                this.$router.push('/');
            } catch (error) {
                console.error('Error al obtener usuarios en getUsers:', error);
                throw error;
            }
        },

        createNewUser() {
            this.isEditing = false;
            this.editedIndex = -1;
            this.editedItem = Object.assign({}, this.defaultItem);
            this.dialog = true;
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
    padding: 2rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border-radius: 2rem;
    margin: auto;
}

.logo {
    width: 250px;
    margin-bottom: 20px;
}
</style>
