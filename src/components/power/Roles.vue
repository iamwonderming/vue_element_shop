<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" @click="addRolesVisible = true"
        >添加用户</el-button
      >
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
            {{ scope.row }}
          </pre
            > -->
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showRolesEditDiglog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addRolesVisible"
      width="50%"
      @close="addRolesClosed()"
    >
      <el-form
        :model="addRole"
        ref="addRolesRef"
        :rules="addRolesRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editRolesVisible" width="50%">
      <el-form
        :model="editRole"
        ref="editRoleRef"
        :rules="editRoleRules"
        label-width="100px"
        @closed="editRolesDiglogClosed()"
      >
        <el-form-item label="id">
          <el-input v-model="editRole.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加分配权限角色对话框 -->
    <el-dialog
      title="分配用户角色"
      :visible.sync="setDialogRightVisible"
      width="50%"
      @close="setRightDialogClosed()"
    >
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      rightList: [],
      // 树形控件
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 三个可视的对话框
      addRolesVisible: false,
      editRolesVisible: false,
      setDialogRightVisible: false,
      addRole: {
        roleName: "",
        roleDesc: "",
      },
      defKeys: [],
      roleId:'',
      editRole: {},
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "角色描述的长度在2~8个字符之间" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "角色描述的长度在2~10个字符之间" },
        ],
      },
      editRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "角色描述的长度在2~8个字符之间" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "角色描述的长度在2~10个字符之间" },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色列表失败！");
      }
      {
        this.roleList = res.data;
      }
    },
    editRolesDiglogClosed() {
      this.$refs.editRoleRef.resetFields();
    },
    // 修改角色接受数据
    async showRolesEditDiglog(id) {
      console.log(id);
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status != 200) {
        return this.$message.error("修改用户失败！");
      }
      console.log(res);
      this.editRole = res.data;
      // console.log(this.editRole)
      this.editRolesVisible = true;
    },
    // 完成修改用户操作
    editUserInfo() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRole.roleId,
          {
            roleName: this.editRole.roleName,
            roleDesc: this.editRole.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改用户失败");
        }

        this.$message.success("修改用户成功");
        this.editRolesVisible = false;
        this.getRolesList();
      });
    },
    // 删除用户操作
    async removeRolesById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);

      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getRolesList();
    },
    // 添加roles用户
    addUser() {
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRole);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }

        this.$message.success("添加用户成功");
        this.addRolesVisible = false;
        this.getRolesList();
      });
    },
    async showSetRightDialog(role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get("rights/tree");
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error("获取分配信息失败");
      }
      this.rightList = res.data;
      this.getLeafKeys(role, this.defKeys);
      this.setDialogRightVisible = true;
    },
    // 分配角色
    addRightClosed() {},
    addRolesClosed() {
      this.$refs.addRolesRef.resetFields();
    },
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除用户，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult != "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );

      if (res.meta.status !== 200) {
        this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      role.children = res.data;
    },
    // 获取角色下所有三级权限的ID，保存到defKeys
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    setRightDialogClosed(){
      this.defKeys = []
    },
    async allotRights(){
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,
      {rids:idStr})
      console.log(res)
      if(res.meta.status !== 200){
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setDialogRightVisible = false

    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>