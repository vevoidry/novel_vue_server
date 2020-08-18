<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-form ref="form" :model="formDataOfLogin" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="formDataOfLogin.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="formDataOfLogin.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { loginRequest } from '@/network/loginRequest'
import { userRequest } from '@/network/userRequest'
import store from '@/store'

export default {
  name: 'Login',
  data: function () {
    return {
      formDataOfLogin: {
        username: null,
        password: null
      }
    }
  },
  methods: {
    login: function () {
      loginRequest({
        url: 'oauth/token',
        method: 'POST',
        headers: {
          Authorization: 'Basic dnVlOjEyMzQ1Ng=='// base64(vue:123456)
        },
        params: {
          username: this.$data.formDataOfLogin.username,
          password: this.$data.formDataOfLogin.password,
          grant_type: 'password',
          scope: 'vue_scope'
        }
      }).then(res => {
        store.state.tokenData = res.data
        this.getUser()
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err,
          type: 'error'
        })
      })
    },
    getUser: function () {
      userRequest({
        url: 'api/me',
        method: 'GET'
      }).then(res => {
        store.state.user = res.data.data
        this.$router.push('/')
      })
    }
  }
}
</script>
