<template>
  <!-- 授权用户 -->
  <el-dialog
    title="选择用户"
    :visible.sync="visible"
    width="800px"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="用户名称" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table
        @row-click="clickRow"
        ref="table"
        :data="userList"
        @selection-change="handleSelectionChange"
        height="260px"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="用户名称"
          align="center"
          prop="username"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          align="center"
          prop="nickname"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机" align="center" prop="phone" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" key="status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
            <el-tag type="danger" v-else>停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="170" />
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedList, authUserSelectAll } from '@/api/system/role';
export default {
  props: {
    // 角色编号
    roleId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        username: undefined,
        phone: undefined,
      },
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.id);
    },
    // 查询表数据
    getList() {
      unallocatedList(this.queryParams).then(res => {
        this.userList = res.rows;
        this.total = res.total;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(',');
      if (userIds == '') {
        this.$modal.msgError('请选择要分配的用户');
        return;
      }
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$modal.msgSuccess('添加成功');
        this.visible = false;
        this.$emit('ok');
      });
    },
  },
};
</script>
