import axios from 'axios'
import router from '@/router'

export default {

    namespaced: true,

    state: {
        Auth: false,
        Data: [],
        Token: '',
        active: false,
        color: '',
        text: '',
        loading: false
    },
    mutations: {

        setLogin(state, data) {
            state.Auth = true
            state.Data = data
            state.Token = data.token
        },

        setError(state, text) {

            state.active = true
            state.color = 'error'
            state.text = text
            setInterval(() => {
                state.active = false
            }, 5000);

        },

        setLogout(state) {
            state.Auth = false
            state.Data = []
            state.Token = ''
        },

        setactiveLoading(state) {
            state.loading = true
        },

        setDesactiveLoading(state) {
            state.loading = false
        }

    },
    actions: {

        async Login({ commit, payload }, dataLogin) {
            try {

                await axios.post('/api/login', {...dataLogin }).then(function(response) {

                        const token = response.data.token

                        console.log(response.data)

                        // token etc
                        if (token) {
                            sessionStorage.setItem('autenticado', true)
                            sessionStorage.setItem('token', token)
                            sessionStorage.setItem('user', response.data.user);
                            // sessionStorage.setItem('refresh_token', response.data.refresh_token)
                            // sessionStorage.setItem('expires', response.data.expires)

                            commit('setLogin', response.data);

                            if (router.history.current.query.from) {
                                router.push(router.history.current.query.from);
                                commit('overlay/setDesactiveOverlay', payload, { root: true })
                                    // setTimeout(() => {
                                    //     commit('setDesactiveLoading')   
                                    // }, 8000);

                            } else {
                                router.push('/home');
                                commit('overlay/setDesactiveOverlay', payload, { root: true })
                            }

                        } else {
                            commit('overlay/setDesactiveOverlay', payload, { root: true })
                            console.log('ocurrio un error')
                                //commit('setDesactiveLoading')
                                //commit('setError','ocurrio un error')
                        }


                    })
                    .catch(function(error) {
                        if (error.response) {
                            if (error.response.status === 401) {
                                console.log('credenciales invalidos')
                                commit('overlay/setDesactiveOverlay', payload, { root: true })
                                commit('modalAlert/setActiveModalCredenciales', payload, { root: true })


                            } else {
                                commit('overlay/setDesactiveOverlay', payload, { root: true })
                                console.log('error de autentificacion')
                                    // commit('modalAlert/setActiveModalCredenciales', payload, { root: true })

                            }
                        }

                    });

            } catch (e) {
                commit('overlay/setDesactiveOverlay', payload, { root: true })
                    // commit('modalAlert/setActiveModalCredenciales', payload, { root: true })
            }


        },

        async Logout({ commit }) {

            sessionStorage.removeItem('autenticado')
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('refresh_token')
            sessionStorage.removeItem('expires')
            commit('setLogout')
            router.push('/')
        }

    },
    getters: {

    }

}