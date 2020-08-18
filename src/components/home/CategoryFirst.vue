<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item :to="{ path: '/home/categoryManagement' }">分类管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formData.name" placeholder="二级分类名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="postCategorySecond">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="categorySecondList" style="width: 100%">
      <el-table-column prop="id" label="二级分类的id" style="width: 33%"></el-table-column>
      <el-table-column prop="name" label="二级分类的name" style="width: 33%"></el-table-column>
      <el-table-column fixed="right" label="操作"  style="width: 34%">
        <template slot-scope="scope">
          <el-button @click="dialogVisible = true;dialogCategoryId = scope.row.id;dialogCategoryName = scope.row.name">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="请输入新的分类名称" :visible.sync="dialogVisible" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="dialogCategoryName" placeholder="新的分类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="putCategoryFirst">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userRequest } from '@/network/userRequest'

export default {
  name: 'CategoryFirst',
  data: function () {
    return {
      id: this.$route.query.id,
      name: null,
      categorySecondList: null,
      formData: {
        name: null
      },
      dialogVisible: false,
      dialogCategoryId: null,
      dialogCategoryName: null
    }
  },
  methods: {
    refreshComponent: function () {
      userRequest({
        url: '/api/category/' + this.id,
        method: 'GET'
      }).then(res => {
        this.name = res.data.data.name
      })
      this.getCategorySeconds()
    },
    // 根据id获取所有二级分类
    getCategorySeconds: function () {
      userRequest({
        url: '/api/category',
        method: 'GET',
        params: {
          rank: 2,
          parent_id: this.id
        }
      }).then(res => {
        this.categorySecondList = res.data.data
      })
    },
    // 新增一个二级分类
    postCategorySecond: function () {
      userRequest({
        url: '/api/category',
        method: 'POST',
        data: {
          rank: 2,
          parent_id: this.id,
          name: this.formData.name
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.refreshComponent()
      })
    },
    // 修改一个二级分类
    putCategoryFirst: function () {
      this.dialogVisible = false
      userRequest({
        url: '/api/category/' + this.dialogCategoryId,
        method: 'PUT',
        data: {
          name: this.dialogCategoryName
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.refreshComponent()
      })
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
