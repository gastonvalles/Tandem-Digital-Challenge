<template>
    <v-container>
        <form @submit.prevent="login" class="form">
            <p class="form-title">Log in to your account</p>
            <div class="input-container">
                <input type="text" id="username" v-model="username" placeholder=" " required />
                <label for="username">Username</label>
            </div>

            <div class="input-container">
                <input type="password" id="password" v-model="password" placeholder=" " required />
                <label for="password">Password</label>
            </div>

            <button type="submit" class="submit">
                LOG IN
                <span class="arrow-wrapper">
                    <span class="arrow"></span>
                </span>
            </button>

            <p class="signup-link">
                No account?
                <a href="">Sign Up</a>
            </p>
        </form>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: '',
        };
    },
    methods: {
        login() {
            if (this.username === 'usuario' && this.password === 'contraseña') {
                this.$router.push('/users');
            } else {
                alert('Credenciales inválidas. Intenta de nuevo.');
            }
        },
    },
};
</script>

<style scoped>
.v-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.form {
    background-color: #fff;
    display: block;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    width: 350px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-title {
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 600;
    text-align: center;
    color: #000;
}

.input-container {
    display: flex;
    flex-direction: column;
    position: relative;
    margin-bottom: 20px;
}

.input-container input {
    background-color: #fff;
    padding: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    width: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.input-container input,
.form submit {
    outline: none;
    border: 1px solid #e5e7eb;
    margin: 8px 0;
}

.input-container input:focus {
    border: solid 2px rgba(26, 115, 232);
    outline: none;
}

.input-container label {
    font-size: 18px;
    position: absolute;
    bottom: 15px;
    left: 10px;
    cursor: pointer;
    color: rgba(0, 0, 0, .4);
    transition: transform .2s;
}

.input-container input:focus+label,
.input-container input:not(:placeholder-shown)+label {
    transform: translateY(-24px);
    background: white;
    color: #1a73e8;
    font-size: 14px;
    padding: 5px;
}

.input-container input:not(:focus)+label {
    color: rgba(0, 0, 0, .4);
}

.submit {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    --primary-color: #1a73e8;
    --secondary-color: #fff;
    --hover-color: #111;
    --arrow-width: 10px;
    --arrow-stroke: 2px;
    background: var(--primary-color);
    color: var(--secondary-color);
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 500;
    width: 100%;
    border-radius: 0.5rem;
    text-transform: uppercase;
    transition: 0.2s background;
    gap: 0.6em;
}

.signup-link {
    color: #6B7280;
    font-size: 0.975rem;
    line-height: 1.25rem;
    text-align: center;
    margin-top: 10px;
}

.signup-link a {
    text-decoration: underline;
}

.submit .arrow-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
}

.submit .arrow {
    margin-top: 1px;
    width: var(--arrow-width);
    background: var(--primary-color);
    height: var(--arrow-stroke);
    position: relative;
    transition: 0.2s;
}

.submit .arrow::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    border: solid var(--secondary-color);
    border-width: 0 var(--arrow-stroke) var(--arrow-stroke) 0;
    display: inline-block;
    top: -3px;
    right: 3px;
    transition: 0.2s;
    padding: 3px;
    transform: rotate(-45deg);
}

.submit:hover {
    background-color: var(--hover-color);
}

.submit:hover .arrow {
    background: var(--secondary-color);
}

.submit:hover .arrow:before {
    right: 0;
}
</style>