<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item>小说管理</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="小说新增" name="insert">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form ref="form" :model="formData" label-width="100px">
              <el-form-item label="小说名称">
                <el-input v-model="formData.name"></el-input>
              </el-form-item>
              <el-form-item label="小说类型">
                <el-cascader v-model="formData.category_ids" :props="props"></el-cascader>
              </el-form-item>
              <el-form-item label="是否已完结">
                <el-switch v-model="formData.is_complete"></el-switch>
              </el-form-item>
              <el-form-item label="小说概述">
                <el-input type="textarea" v-model="formData.summary"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="postNovel">新增小说</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="小说查询" name="select">
        <el-row>
          <el-col :span="16" :offset="4">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="小说类型">
                <el-cascader v-model="category_ids" :props="props"></el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button @click="getNovel">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-table :data="novelList" style="width: 100%">
          <el-table-column prop="id" label="小说id" style="width: 25%;"></el-table-column>
          <el-table-column prop="name" label="小说名称" style="width: 25%;"></el-table-column>
          <el-table-column prop="summary" label="小说概述" style="width: 25%;"></el-table-column>
          <el-table-column fixed="right" label="操作"  style="width: 25%">
            <template slot-scope="scope">
              <el-button @click="$router.push({path: '/home/novel',query: {id: scope.row.id}})">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { userRequest } from '@/network/userRequest'
export default {
  name: 'NovelManagement',
  data: function () {
    return {
      categoryFirstList: null,
      formData: {
        name: null,
        category_ids: null,
        is_complete: false,
        summary: null
      },
      category_ids: null,
      novelList: null,
      props: {
        lazy: true,
        lazyLoad (node, resolve) {
          let rank = 1
          let parentId = 0
          if (node.level !== 0) {
            rank = 2
            parentId = node.value
          }
          userRequest({
            url: '/api/category',
            method: 'GET',
            params: {
              rank: rank,
              parent_id: parentId
            }
          }).then(res => {
            const nodes = res.data.data.map(item => ({
              value: item.id,
              label: item.name,
              leaf: item.rank === 2
            }))
            resolve(nodes)
          })
        }
      },
      activeName: 'insert'
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
    postNovel () {
      if (this.formData.category_ids == null) {
        this.$message('小说类型不可为null')
        return
      }
      userRequest({
        url: '/api/novel',
        method: 'POST',
        data: {
          user_id: this.$store.state.user.id,
          category_id: this.formData.category_ids[1],
          name: this.formData.name,
          summary: this.formData.summary,
          image: 'default_novel_image.png',
          is_complete: this.formData.is_complete
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
      })
    },
    getNovel () {
      if (this.category_ids == null) {
        this.$message({
          showClose: true,
          message: '小说类型不可为null',
          type: 'error'
        })
        return
      }
      userRequest({
        url: '/api/novel',
        method: 'GET',
        params: {
          category_id: this.category_ids[1]
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.novelList = res.data.data
      })
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
