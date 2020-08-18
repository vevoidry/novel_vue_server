<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item :to="{ path: '/home/novelManagement' }">小说管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{novel.name}}</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-row>
      <el-col :span="12">
        <el-row>
          <el-col :span="16">
            <el-image :src="'http://localhost:9090/images/'+novel.image" fit="fill"></el-image>
          </el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfImage = true;">修改</el-button></el-col>
        </el-row>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="16">小说名称：{{novel.name}}</el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfName = true;dialogDataOfName = novel.name">修改</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">小说概述：{{novel.summary}}</el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfSummary = true;dialogDataOfSummary = novel.summary">修改</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">小说分类：{{parentCategoryName}}-{{categoryName}}</el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfCategory_id = true">修改</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">推荐系数：{{novel.multiplier}}</el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfMultiplier = true;dialogDataOfMultiplier = novel.multiplier">修改</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="16">推荐常数：{{novel.addend}}</el-col>
          <el-col :span="8"><el-button @click="dialogVisibleOfAddend = true;dialogDataOfAddend = novel.addend">修改</el-button></el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-button v-if="!hasRecommended" @click="postRecommend">推荐</el-button>
            <el-button v-else @click="deleteRecommend">取消推荐</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-form ref="form" label-width="80px">
      <el-form-item label="卷名">
        <el-input v-model="newVolumeName" placeholder="卷名"></el-input>
      </el-form-item>
      <el-form-item label="概述">
        <el-input type="textarea" v-model="newVolumeSummary" placeholder="概述"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="postVolume">立即创建</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="volumeList" style="width: 100%">
      <el-table-column prop="id" label="卷的id" style="width: 33%"></el-table-column>
      <el-table-column prop="name" label="卷的name" style="width: 33%"></el-table-column>
      <el-table-column fixed="right" label="操作"  style="width: 34%">
        <template slot-scope="scope">
          <el-button @click="$router.push({path:'/home/volume',query: {id:scope.row.id}})">查看</el-button>
          <el-button @click="dialogVisibleOfNameOfVolume = true;dialogDataOfIdOfVolume = scope.row.id;dialogDataOfNameOfVolume = scope.row.name;">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="请输入新的image" :visible.sync="dialogVisibleOfImage" width="21%">
      <el-upload class="upload-demo" action="http://localhost:9090/api/novel/image" :headers="{authorization: 'bearer '+$store.state.tokenData.access_token}" :limit="1" :file-list="dialogDataOfImageList" :on-success="postImageSuccess" :on-error="postImageError">
        <el-button>点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传png文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog title="请输入新的name" :visible.sync="dialogVisibleOfName" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="dialogDataOfName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchName">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的summary" :visible.sync="dialogVisibleOfSummary" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input type="textarea" v-model="dialogDataOfSummary"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchSummary">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的category_id" :visible.sync="dialogVisibleOfCategory_id" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-cascader v-model="dialogDataOfCategory_ids" :props="props"></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchCategory_id">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的multiplier" :visible.sync="dialogVisibleOfMultiplier" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input type="number" v-model="dialogDataOfMultiplier"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchMultiplier">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的addend" :visible.sync="dialogVisibleOfAddend" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input type="number" v-model="dialogDataOfAddend"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchAddend">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="请输入新的卷的name" :visible.sync="dialogVisibleOfNameOfVolume" width="21%">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="dialogDataOfNameOfVolume"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchNameOfVolume">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userRequest } from '@/network/userRequest'
export default {
  name: 'Novel',
  data: function () {
    return {
      id: this.$route.query.id,
      novel: null,
      parentCategoryName: null,
      categoryName: null,
      category_ids: null,
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
      newVolumeName: null,
      newVolumeSummary: null,
      volumeList: null,
      dialogVisibleOfImage: false,
      dialogDataOfImageList: null,
      dialogVisibleOfName: false,
      dialogDataOfName: null,
      dialogVisibleOfSummary: false,
      dialogDataOfSummary: null,
      dialogVisibleOfCategory_id: false,
      dialogDataOfCategory_ids: null,
      dialogVisibleOfMultiplier: false,
      dialogDataOfMultiplier: null,
      dialogVisibleOfAddend: false,
      dialogDataOfAddend: null,
      dialogVisibleOfNameOfVolume: false,
      dialogDataOfIdOfVolume: null,
      dialogDataOfNameOfVolume: null,
      hasRecommended: false
    }
  },
  methods: {
    refreshComponent: function () {
      this.getNovel()
      this.getRecommend()
    },
    getNovel: function () {
      // 根据id获取novel
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'GET'
      }).then(res => {
        this.novel = res.data.data
        this.getParentCategoryNameAndCategoryName()
        this.getVolume()
      })
    },
    getParentCategoryNameAndCategoryName: function () {
      userRequest({
        url: '/api/category/' + this.novel.category_id,
        method: 'GET'
      }).then(res => {
        this.categoryName = res.data.data.name
        userRequest({
          url: '/api/category/' + res.data.data.parent_id,
          method: 'GET'
        }).then(res => {
          this.parentCategoryName = res.data.data.name
        })
      })
    },
    getVolume: function () {
      userRequest({
        url: '/api/volume',
        method: 'GET',
        params: {
          novel_id: this.id
        }
      }).then(res => {
        this.volumeList = res.data.data
      })
    },
    postVolume: function () {
      userRequest({
        url: '/api/volume',
        method: 'POST',
        data: {
          novel_id: this.id,
          name: this.newVolumeName,
          summary: this.newVolumeSummary
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getNovel()
      })
    },
    postImageSuccess: function (response) {
      this.$message({
        showClose: true,
        message: '上传成功',
        type: 'success'
      })
      userRequest({
        url: '/api/novel/image',
        method: 'PATCH',
        data: {
          image: response.data,
          novel_id: this.id
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
    postImageError: function () {
      this.$message({
        showClose: true,
        message: '上传失败，请稍后再试',
        type: 'error'
      })
    },
    patchName: function () {
      this.dialogVisibleOfName = false
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'PATCH',
        data: {
          name: this.dialogDataOfName
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
    patchSummary: function () {
      this.dialogVisibleOfSummary = false
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'PATCH',
        data: {
          summary: this.dialogDataOfSummary
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
    patchCategory_id: function () {
      this.dialogVisibleOfCategory_id = false
      if (this.dialogDataOfCategory_ids == null) {
        this.$message('小说类型不可为null')
        return
      }
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'PATCH',
        data: {
          category_id: this.dialogDataOfCategory_ids[1]
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
    patchMultiplier: function () {
      this.dialogVisibleOfMultiplier = false
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'PATCH',
        data: {
          multiplier: this.dialogDataOfMultiplier
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
    patchAddend: function () {
      this.dialogVisibleOfAddend = false
      userRequest({
        url: '/api/novel/' + this.id,
        method: 'PATCH',
        data: {
          addend: this.dialogDataOfAddend
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
    patchNameOfVolume: function () {
      this.dialogVisibleOfNameOfVolume = false
      userRequest({
        url: '/api/volume/' + this.dialogDataOfIdOfVolume,
        method: 'PATCH',
        data: {
          name: this.dialogDataOfNameOfVolume
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
    postRecommend: function () {
      userRequest({
        url: '/api/recommend',
        method: 'POST',
        data: {
          novel_id: this.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getRecommend()
      })
    },
    deleteRecommend: function () {
      userRequest({
        url: '/api/recommend',
        method: 'DELETE',
        params: {
          novel_id: this.id,
          user_id: this.$store.state.user.id
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getRecommend()
      })
    },
    getRecommend: function () {
      userRequest({
        url: '/api/recommend',
        method: 'GET',
        params: {
          novel_id: this.id,
          user_id: this.$store.state.user.id
        }
      }).then(res => {
        if (res.data.data == null) {
          this.hasRecommended = false
        } else {
          this.hasRecommended = true
        }
      })
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
