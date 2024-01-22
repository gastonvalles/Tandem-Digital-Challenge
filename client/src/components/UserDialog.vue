<!-- Diálogo para editar o crear un nuevo usuario -->
<template>
    <v-dialog v-model="dialogCopy" max-width="500px">
        <!-- Activador del diálogo (un botón) -->
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="#009688" dark class=" ml-5" v-bind="attrs" v-on="on">
                Nuevo Usuario
            </v-btn>
        </template>
        <!-- Contenido del diálogo -->
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ getTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <!-- Formulario para editar o crear un usuario -->
                    <v-row>
                        <!-- Campos para el nombre, apellido, email, teléfono, usuario y contraseña -->
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.nombre" label="Nombre"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.apellido" label="Apellido"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.email" :rules="emailRules" label="E-mail"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.telefono" maxlength="14" label="Teléfono"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.usuario" label="Usuario"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="editedCopy.contraseña" label="Contraseña" type="password"></v-text-field>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <!-- Acciones en el pie del diálogo -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <!-- Botón para cancelar el diálogo -->
                <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                </v-btn>
                <!-- Botón para guardar los cambios o crear un nuevo usuario -->
                <v-btn color="blue darken-1" text @click="save">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    // Propiedades recibidas del componente padre
    props: {
        formTitle: String,
        users: Array,
        editedItem: Object,
        dialog: Boolean,
        errorMensaje: String,
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
    },
    // Datos locales del componente
    data() {
        return {
            dialogCopy: false,
            editedCopy: { ...this.editedItem },
        }
    },
    // Propiedad computada para obtener el título del formulario
    computed: {
        getTitle() {
            return this.editedItem.id ? 'Editar Usuario' : 'Nuevo Usuario';
        },
    },
    // Métodos del componente
    methods: {
        // Emite el evento para editar un usuario
        editItem() {
            this.$emit('edit-user');
        },
        // Cierra el diálogo
        close() {
            this.dialogCopy = false;
            this.editedCopy = { ...this.editedItem };
            this.$emit('close-dialog', this.editedCopy);
        },
        // Guarda los cambios o crea un nuevo usuario
        save() {
            this.$emit('save-user', this.editedCopy);
        },
    },
};
</script>
