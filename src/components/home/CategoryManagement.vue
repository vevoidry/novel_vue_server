<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item>分类管理</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="newCategoryName" placeholder="新分类名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="postCategoryFirst">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="categoryFirstList" style="width: 100%">
      <el-table-column prop="id" label="一级分类的id" style="width: 33%"></el-table-column>
      <el-table-column prop="name" label="一级分类的name" style="width: 33%"></el-table-column>
      <el-table-column fixed="right" label="操作"  style="width: 34%">
        <template slot-scope="scope">
          <el-button @click="$router.push({path: '/home/categoryFirst',query: {id: scope.row.id}})">查看</el-button>
          <el-button @click="dialogVisible = true;dialogCategoryId = scope.row.id;dialogCategoryName = scope.row.name;">编辑</el-button>
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
  name: 'CategoryManagement',
  data: function () {
    return {
      categoryFirstList: null,
      newCategoryName: null,
      dialogVisible: false,
      dialogCategoryId: null,
      dialogCategoryName: null
    }
  },
  methods: {
    refreshComponent: function () {
      this.getCategoryFirsts()
    },
    getCategoryFirsts: function () {
      userRequest({
        url: '/api/category',
        method: 'GET',
        params: {
          rank: 1,
          parent_id: 0
        }
      }).then(res => {
        this.categoryFirstList = res.data.data
      })
    },
    // 新增一个一级分类
    postCategoryFirst: function () {
      userRequest({
        url: '/api/category',
        method: 'POST',
        data: {
          rank: 1,
          parent_id: 0,
          name: this.newCategoryName
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
    // 修改一个一级分类
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
