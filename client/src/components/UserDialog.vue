<template>
    <v-dialog v-model="dialogCopy" max-width="500px">
        <template v-slot:activator="{ on, attrs }">
            <v-btn color="#009688" dark class=" ml-5" v-bind="attrs" v-on="on">
                Nuevo Usuario
            </v-btn>
        </template>
        <v-card>
            <v-card-title>
                <span class="text-h5">{{ getTitle }}</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
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
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                    Guardar
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
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
    data() {
        return {
            dialogCopy: false,
            editedCopy: { ...this.editedItem },
        }
    },
    computed: {
        getTitle() {
            return this.editedItem.id ? 'Editar Usuario' : 'Nuevo Usuario';
        },
    },
    methods: {
        editItem() {
            this.$emit('edit-user');
        },
        close() {
            this.dialogCopy = false;
            this.editedCopy = { ...this.editedItem };
            this.$emit('close-dialog', this.editedCopy);
        },
        save() {
            this.$emit('save-user', this.editedCopy);
        },
    },
};
</script>