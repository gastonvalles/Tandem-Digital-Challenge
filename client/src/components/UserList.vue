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
                    <v-data-table :headers="headers" :items="users" class="elevation-1" :search="search">
                        <template v-slot:top>
                            <v-toolbar flat>
                                <v-row>
                                    <v-col xs="6" md="6" sm="6">
                                        <v-text-field v-model="search" color="#009688" append-icon="mdi-magnify"
                                            label="Search" single-line hide-details></v-text-field>
                                    </v-col>
                                </v-row>
                                <user-dialog :formTitle="formTitle" :editedItem="editedItem" :dialog="dialog" :users="users"
                                    :editedIndex="editedIndex" :errorMensaje="errorMensaje" @edit-user="editItem"
                                    @save-user="save" @close-dialog="close"></user-dialog>
                            </v-toolbar>
                        </template>
                        <template v-slot:[`item.actions`]="{ item }">
                            <v-icon small class="mr-2" @click="editItem(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="deleteItem(item)">
                                mdi-delete
                            </v-icon>
                        </template>
                    </v-data-table>
                    <div class="text-center mt-5">
                        <v-btn color="red" dark @click="logout">Cerrar Sesión</v-btn>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import UserDialog from './UserDialog.vue';

export default {
    components: {
        UserDialog,
    },
    data: () => ({
        search: '',
        dialog: false,
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
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
        },
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
    },

    created() {
        this.initialize();
    },

    methods: {
        async fetchUsuarios() {
            try {
                const response = await axios.get('http://localhost:3000/users', {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                return response.data;
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        },

        async initialize() {
            this.users = await this.fetchUsuarios();
        },

        editItem(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem(item) {
            this.editedIndex = this.users.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async deleteItemConfirm(item) {
            try {
                await axios.delete(`http://localhost:3000/users/${item.id}`, {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                this.initialize();
                this.closeDelete();
            } catch (error) {
                console.error('Error al borrar el usuario:', error);
            }
        },

        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        async save() {
            if (this.editedItem.usuario.length > 0) {
                try {
                    if (this.editedIndex === -1) {
                        await axios.post('http://localhost:3000/users', this.editedItem, {
                            headers: {
                                Authorization: sessionStorage.getItem('token'),
                            },
                        });
                    } else {
                        await axios.put(`http://localhost:3000/users/${this.editedItem.id}`, this.editedItem, {
                            headers: {
                                Authorization: sessionStorage.getItem('token'),
                            },
                        });
                    }
                    this.initialize();
                    this.close();
                } catch (error) {
                    const email = /.+@.+\..+/.test(this.editedItem.email);
                    if (!email) {
                        this.mostrarError('El correo ingresado es invalido');
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

        mostrarError(mensaje) {
            this.errorMensaje = mensaje;
            setTimeout(() => {
                this.errorMensaje = '';
            }, 4000);
        },

        async logout() {
            try {
                await axios.post('http://localhost:3000/logout', null, {
                    headers: {
                        Authorization: sessionStorage.getItem('token'),
                    },
                });
                sessionStorage.removeItem('token');
                this.$router.push('/');
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            }
        },
    },
};
</script>

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