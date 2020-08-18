<template>
  <div>
    <el-breadcrumb>
      <h3>
        <el-breadcrumb-item :to="{ path: '/home/novelManagement' }">小说管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/novel',query: {id: novel.id} }">{{novel.name}}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home/volume',query: {id: volume.id} }">{{volume.name}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{chapter.title}}</el-breadcrumb-item>
      </h3>
    </el-breadcrumb>
    <el-button @click="dialogVisibleOfContent = true;dialogDataOfContent = chapterContent">修改</el-button>
    <el-input type="textarea" v-model="chapterContent" readonly :autosize="true"></el-input>
    <el-dialog title="请输入新的summary" :visible.sync="dialogVisibleOfContent" width="60%">
      <el-form>
        <el-form-item>
          <el-input type="textarea" v-model="dialogDataOfContent" placeholder="章节的内容" :autosize="{ minRows: 15 }"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="patchChapterContent">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { userRequest } from '@/network/userRequest'

export default {
  name: 'Chapter',
  data: function () {
    return {
      id: this.$route.query.id,
      chapter: null,
      volume: null,
      novel: null,
      chapterContent: null,
      dialogVisibleOfContent: false,
      dialogDataOfContent: null
    }
  },
  methods: {
    refreshComponent: function () {
      this.getChapter()
    },
    getChapter: function () {
      userRequest({
        url: '/api/chapter/' + this.id,
        method: 'GET'
      }).then(res => {
        this.chapter = res.data.data
        this.getVolume()
        this.getChapterContent()
      })
    },
    getVolume: function () {
      userRequest({
        url: '/api/volume/' + this.chapter.volume_id,
        method: 'GET'
      }).then(res => {
        this.volume = res.data.data
        this.getNovel()
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
    getChapterContent: function () {
      userRequest({
        url: '/api/chapter/content',
        method: 'GET',
        params: {
          content: this.chapter.content
        }
      }).then(res => {
        this.chapterContent = res.data.data
      })
    },
    patchChapterContent: function () {
      this.dialogVisibleOfContent = false
      userRequest({
        url: '/api/chapter/content',
        method: 'PATCH',
        params: {
          content: this.chapter.content
        },
        data: {
          chapterContent: this.dialogDataOfContent
        }
      }).then(res => {
        this.chapterContent = res.data.data
        this.$message({
          showClose: true,
          message: res.data.message,
          type: 'success'
        })
      })
    }
  },
  mounted () {
    this.refreshComponent()
  }
}
</script>
