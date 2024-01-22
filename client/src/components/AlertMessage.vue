<!-- Componente para mostrar mensajes de alerta -->
<template>
    <v-row>
        <v-col>
            <!-- Muestra la alerta solo si hay un mensaje de error -->
            <v-alert v-if="errorMessage" type="error" style="position: fixed; top: 20px; right: 20px">
                {{ errorMessage }}
            </v-alert>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        errorMessage: {
            type: String,
            default: "",
        },
    },
};
</script>
