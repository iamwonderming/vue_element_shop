<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number"> </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="order_pay"> 
          <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.order_pay === '1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time"> 
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"> 
          <template slot-scope="">
              <el-button size="mini" type="primary" icon="el-icon-edit"
              @click="showBox"></el-button>
              <el-button size="mini" type="success" icon="el-icon-location"
              @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background=""
      >
      </el-pagination>
    </el-card>

        <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址信息"
      :visible.sync="addressVisible"
      width="50%"
      @close="adderssDialogClosed"
    >
      <el-form
        :model="addressForm"
        ref="addressFormRef"
        :rules="addressFormRules"
        label-width="100px"
      >
        <el-form-item label="省市县区" prop="address1">
            <el-cascader
              :options="cityData"
              v-model="addressForm.address1">
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible=false">确 定</el-button>
      </span>
    </el-dialog>
        <!-- 查看物流对话框 -->
    <el-dialog
      title="查看物流信息"
      :visible.sync="progressVisible"
      width="50%"
    >
    <div class="block">
  <el-timeline>
    <el-timeline-item timestamp="2021/09/12" placement="top">
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王XX 提交于 2021/09/12 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2021/09/3" placement="top">
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王XX 提交于 2021/09/13 20:46</p>
      </el-card>
    </el-timeline-item>
    <el-timeline-item timestamp="2021/09/2" placement="top">
      <el-card>
        <h4>更新 Github 模板</h4>
        <p>王XX 提交于 2021/09/14 20:46</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</div>
    </el-dialog>
  </div>
</template>

<script>
  import cityData from '@/components/order/cityData'
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      addressVisible:false,
      progressVisible:false,
      progressInfo:[],
      addressForm:{
        address1:[],
        address2:''
      },
      cityData,
addressFormRules:{
  address1: [
          { required: true, message: "请输入省市县区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
}
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error();
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
          handleSizeChange(newSize) {
    // console.log(newSize)
    this.queryInfo.pagesize = newSize;
    this.getOrderList();
  },
  handleCurrentChange(newPage) {
    // console.log(newPage)
    this.queryInfo.pagenum = newPage;
    this.getOrderList();
  },
  showBox(){
    this.addressVisible = true
  },
  adderssDialogClosed(){
    this.$refs.addressFormRef.resetFields()
  },
  // async showProgressBox(){
  //   const {data:res} = await this.$http.get('/kuaidi/1106975712662')
  //   if(res.meta.status !== 200){
  //     return this.$message.error('获取物流进度失败！')
  //   }
  //   this.progressInfo = res.data
  //   this.progressVisible = true
  //   console.log(this.progressInfo)
  // },
  showProgressBox(){
    // const {data:res} = await this.$http.get('/kuaidi/1106975712662')
    // if(res.meta.status !== 200){
    //   return this.$message.error('获取物流进度失败！')
    // }
    // this.progressInfo = res.data
    this.progressVisible = true
    // console.log(this.progressInfo)
  }
  },
};
</script>

<style lang="less" scoped>
.el-pagination{
  margin-top: 15px;
}
</style>