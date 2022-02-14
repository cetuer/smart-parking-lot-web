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
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-permission="['system:role:edit']"
        >修改</el-button>
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
        >删除</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
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
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope" v-if="scope.row.id !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:role:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:role:remove']"
          >删除</el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['system:role:edit']">
            <span class="el-dropdown-link">
              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleDataScope" icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']">数据权限</el-dropdown-item>
              <el-dropdown-item command="handleAuthUser" icon="el-icon-user"
                v-hasPermi="['system:role:edit']">分配用户</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
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
            v-model="form.menuCheckStrictly"
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
            :check-strictly="!form.menuCheckStrictly"
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

    <!-- 分配角色数据权限对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中,请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listRoleByPage, checkRoleNameUnique, addRole } from '@/api/system/role';
import { treeSelect as menuTreeSelect } from '@/api/system/menu';
// import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";

export default {
  name: 'Role',
  data() {
    const validatorRoleName = (rule, value, callback) => {
      checkRoleNameUnique(value).then(res => {
        if (!res) {
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
      // // 是否显示弹出层（数据权限）
      // openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      // // 数据范围选项
      // dataScopeOptions: [
      //   {
      //     value: "1",
      //     label: "全部数据权限"
      //   },
      //   {
      //     value: "2",
      //     label: "自定数据权限"
      //   },
      //   {
      //     value: "3",
      //     label: "本部门数据权限"
      //   },
      //   {
      //     value: "4",
      //     label: "本部门及以下数据权限"
      //   },
      //   {
      //     value: "5",
      //     label: "仅本人数据权限"
      //   }
      // ],
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
    // /** 根据角色ID查询菜单树结构 */
    // getRoleMenuTreeselect(roleId) {
    //   return roleMenuTreeselect(roleId).then(response => {
    //     this.menuOptions = response.menus;
    //     return response;
    //   });
    // },
    // /** 根据角色ID查询部门树结构 */
    // getRoleDeptTreeselect(roleId) {
    //   return roleDeptTreeselect(roleId).then(response => {
    //     this.deptOptions = response.depts;
    //     return response;
    //   });
    // },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // // 取消按钮（数据权限）
    // cancelDataScope() {
    //   this.openDataScope = false;
    //   this.reset();
    // },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      (this.menuExpand = false),
        (this.menuNodeAll = false),
        (this.menuOptions = []),
        (this.form = {
          id: undefined,
          name: undefined,
          order: 1,
          status: 1,
          menuIds: [],
          menuCheckStrictly: true,
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
    // // 更多操作触发
    // handleCommand(command, row) {
    //   switch (command) {
    //     case "handleDataScope":
    //       this.handleDataScope(row);
    //       break;
    //     case "handleAuthUser":
    //       this.handleAuthUser(row);
    //       break;
    //     default:
    //       break;
    //   }
    // },
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
      this.form.menuCheckStrictly = value ? true : false;
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.getMenuTreeSelect();
      this.open = true;
      this.title = '添加角色';
    },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   this.reset();
    //   const roleId = row.roleId || this.ids
    //   const roleMenu = this.getRoleMenuTreeselect(roleId);
    //   getRole(roleId).then(response => {
    //     this.form = response.data;
    //     this.open = true;
    //     this.$nextTick(() => {
    //       roleMenu.then(res => {
    //         let checkedKeys = res.checkedKeys
    //         checkedKeys.forEach((v) => {
    //             this.$nextTick(()=>{
    //                 this.$refs.menu.setChecked(v, true ,false);
    //             })
    //         })
    //       });
    //     });
    //     this.title = "修改角色";
    //   });
    // },
    // /** 选择角色权限范围触发 */
    // dataScopeSelectChange(value) {
    //   if(value !== '2') {
    //     this.$refs.dept.setCheckedKeys([]);
    //   }
    // },
    // /** 分配数据权限操作 */
    // handleDataScope(row) {
    //   this.reset();
    //   const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
    //   getRole(row.roleId).then(response => {
    //     this.form = response.data;
    //     this.openDataScope = true;
    //     this.$nextTick(() => {
    //       roleDeptTreeselect.then(res => {
    //         this.$refs.dept.setCheckedKeys(res.checkedKeys);
    //       });
    //     });
    //     this.title = "分配数据权限";
    //   });
    // },
    // /** 分配用户操作 */
    // handleAuthUser: function(row) {
    //   const roleId = row.roleId;
    //   this.$router.push("/system/role-auth/user/" + roleId);
    // },
    // 提交按钮
    submitForm: function () {
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
    // /** 提交按钮（数据权限） */
    // submitDataScope: function() {
    //   if (this.form.roleId != undefined) {
    //     this.form.deptIds = this.getDeptAllCheckedKeys();
    //     dataScope(this.form).then(response => {
    //       this.$modal.msgSuccess("修改成功");
    //       this.openDataScope = false;
    //       this.getList();
    //     });
    //   }
    // },
    // /** 删除按钮操作 */
    // handleDelete(row) {
    //   const roleIds = row.roleId || this.ids;
    //   this.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function() {
    //     return delRole(roleIds);
    //   }).then(() => {
    //     this.getList();
    //     this.$modal.msgSuccess("删除成功");
    //   }).catch(() => {});
    // },
  },
};
</script>