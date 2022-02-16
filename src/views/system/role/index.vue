<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入角色名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="角色状态" clearable size="small">
          <el-option label="正常" value="1" />
          <el-option label="停用" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">
          搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-permission="['system:role:add']"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-permission="['system:role:edit']"
        >
          修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-permission="['system:role:remove']"
        >
          删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" :selectable="disabledRole" />
      <el-table-column label="角色编号" prop="id" align="center" />
      <el-table-column label="角色名称" prop="name" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="显示顺序" prop="order" align="center" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
          <el-tag type="danger" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-permission="['system:role:edit']"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-permission="['system:role:remove']"
          >
            删除
          </el-button>
                    <el-button
            size="mini"
            type="text"
            icon="el-icon-user"
            @click="handleAuthUser(scope.row)"
            v-permission="['system:role:edit']"
          >
            分配用户
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" status-icon label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="order">
          <el-input-number v-model="form.order" controls-position="right" :min="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">
            展开/折叠
          </el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">
            全选/全不选
          </el-checkbox>
          <el-checkbox
            v-model="menuCheckStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
          >
            父子联动
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!menuCheckStrictly"
            empty-text="暂无数据"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listRoleByPage,
  checkRoleNameUnique,
  addRole,
  getRole,
  updateRole,
  delRole,
} from '@/api/system/role';
import { treeSelect as menuTreeSelect, roleMenuTreeSelect } from '@/api/system/menu';

export default {
  name: 'Role',
  data() {
    const validatorRoleName = (rule, value, callback) => {
      checkRoleNameUnique(value).then(res => {
        if (this.form.id != undefined) {
          if (value === this.roleName) {
            return callback();
          } else {
            return callback(new Error('角色名已存在'));
          }
        }
        if (res) {
          callback(new Error('角色名已存在'));
        }
        callback();
      });
    };
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 临时保存角色名用于验证是否已存在
      roleName: undefined,
      // 是否展开
      menuExpand: false,
      // 是否选择所有
      menuNodeAll: false,
      // 是否父子联动
      menuCheckStrictly: false,
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { validator: validatorRoleName, trigger: 'blur' },
        ],
        order: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 是否不可操作
    disabledRole(row) {
      return row.id !== 1;
    },
    // 查询角色列表
    getList() {
      this.loading = true;
      listRoleByPage(this.queryParams).then(response => {
        this.roleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询菜单树结构
    getMenuTreeSelect() {
      menuTreeSelect().then(response => {
        this.menuOptions = response;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 根据角色ID查询菜单树结构
    getRoleMenuTreeSelect(roleId) {
      return roleMenuTreeSelect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.menuCheckStrictly = false),
        (this.menuOptions = []),
        (this.form = {
          id: undefined,
          name: undefined,
          order: 1,
          status: 1,
          menuIds: [],
        });
      this.resetForm('form');
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 展开/折叠
    handleCheckedTreeExpand(value, type) {
      let treeList = this.menuOptions;
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 全选/全不选
    handleCheckedTreeNodeAll(value, type) {
      this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
    },
    // 父子联动
    handleCheckedTreeConnect(value, type) {
      this.menuCheckStrictly = value ? true : false;
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.getMenuTreeSelect();
      this.open = true;
      this.title = '添加角色';
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.reset();
      const roleId = row.id || this.ids;
      const roleMenu = this.getRoleMenuTreeSelect(roleId);
      getRole(roleId).then(response => {
        this.form = response;
        this.roleName = this.form.name;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.checkedKeys;
            checkedKeys.forEach(v => {
              this.$nextTick(() => {
                this.$refs.menu.setChecked(v, true, false);
              });
            });
          });
        });
        this.title = '修改角色';
      });
    },
    // 分配用户操作
    handleAuthUser(row) {                                                                                                                                                                                                                                                                                                                                             
      const roleId = row.id;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 删除按钮操作
    handleDelete(row) {
      const roleIds = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?')
        .then(function () {
          return delRole(roleIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess('删除成功');
        })
        .catch(() => {});
    },
  },
};
</script>