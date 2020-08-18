<template>
  <div>
    <el-container>
      <el-aside style="width: 20%">
        <el-row type="flex" justify="center">
          <el-col :span="18"><h2>非常小说网后台</h2></el-col>
        </el-row>
        <el-menu>
          <el-menu-item v-for="(item,i) in menus" :key="i" :index="i+''" @click="$router.push(item.url)">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
          <el-menu-item @click="logout">
            <i class="el-icon-close"></i>
            <span slot="title">退出</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: function () {
    return {
      menus: [
        {
          name: '分类管理',
          icon: 'el-icon-menu',
          url: '/home/categoryManagement'
        },
        {
          name: '小说管理',
          icon: 'el-icon-reading',
          url: '/home/novelManagement'
        }
      ]
    }
  },
  methods: {
    logout: function () {
      this.$store.state.tokenData = null
      this.$store.state.user = null
      this.$router.push('/')
    }
  }
}
</script>
