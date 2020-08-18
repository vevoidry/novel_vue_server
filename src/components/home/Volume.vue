<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item :to="{ path: '/home/novelManagement' }">小说管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/novel',query: {id: novel.id} }">{{novel.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{volume.name}}</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-row>
      <el-col :span="16">{{volume.name}}</el-col>
      <el-col :span="8"><el-button @click="dialogVisibleOfName = true;dialogDataOfName = volume.name">修改</el-button></el-col>
    </el-row>
    <el-row>
      <el-col :span="16">{{volume.summary}}</el-col>
      <el-col :span="8"><el-button @click="dialogVisibleOfSummary = true;dialogDataOfSummary = volume.summary">修改</el-button></el-col>
    </el-row>
    <el-button @click="newChapterVisible = true">添加章节</el-button>
    <el-row v-for="(item,i) in chapterList" :key="i">
      <el-col :span="12">{{item.title}}</el-col>
      <el-col :span="12"><el-button @click="$router.push({path: '/home/chapter',query: {id: item.id}})">查看</el-button></el-col>
    </el-row>
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
    <el-dialog title="请输入新的chapter" :visible.sync="newChapterVisible" width="60%">
      <el-form>
        <el-form-item>
          <el-input v-model="newChapterTitle" placeholder="章节的标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="textarea" v-model="newChapterContent" placeholder="章节的内容" :autosize="{ minRows: 15 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="postChapter">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userRequest } from '@/network/userRequest'
export default {
  name: 'Volume',
  data: function () {
    return {
      id: this.$route.query.id,
      volume: null,
      novel: null,
      chapterList: null,
      dialogVisibleOfName: false,
      dialogDataOfName: null,
      dialogVisibleOfSummary: false,
      dialogDataOfSummary: null,
      newChapterVisible: false,
      newChapterTitle: null,
      newChapterContent: null
    }
  },
  methods: {
    refreshComponent: function () {
      this.getVolume()
    },
    getVolume: function () {
      userRequest({
        url: '/api/volume/' + this.id,
        method: 'GET'
      }).then(res => {
        this.volume = res.data.data
        this.getNovel()
        this.getChapter()
      })
    },
    getNovel: function () {
      userRequest({
        url: '/api/novel/' + this.volume.novel_id,
        method: 'GET'
      }).then(res => {
        this.novel = res.data.data
      })
    },
    postChapter: function () {
      this.newChapterVisible = false
      userRequest({
        url: '/api/chapter',
        method: 'POST',
        data: {
          volume_id: this.id,
          title: this.newChapterTitle,
          chapterContent: this.newChapterContent
        }
      }).then(res => {
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
        this.getVolume()
      })
    },
    getChapter: function () {
      userRequest({
        url: '/api/chapter',
        method: 'GET',
        params: {
          volume_id: this.id
        }
      }).then(res => {
        this.chapterList = res.data.data
      })
    },
    patchName: function () {
      this.dialogVisibleOfName = false
      userRequest({
        url: '/api/volume/' + this.id,
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
        this.getVolume()
      })
    },
    patchSummary: function () {
      this.dialogVisibleOfSummary = false
      userRequest({
        url: '/api/volume/' + this.id,
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
        this.getVolume()
      })
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
