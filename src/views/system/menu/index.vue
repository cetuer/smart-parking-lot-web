<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否显示" prop="visible">
        <el-select v-model="queryParams.visible" placeholder="是否显示" clearable size="small">
          <el-option label="显示" value="1" />
          <el-option label="隐藏" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
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
          v-permission="['system:menu:add']"
        >
          新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">
          展开/折叠
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" :show-overflow-tooltip="true" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" align="center" />
      <el-table-column prop="perms" label="权限标识" align="center" :show-overflow-tooltip="true" />
      <el-table-column
        prop="componentPath"
        label="组件路径"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="是否显示" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.visible === 1">显示</el-tag>
          <el-tag type="danger" v-else>隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
          <el-tag type="danger" v-else>停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="170px" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160px">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-permission="['system:menu:add']"
          >
            新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-permission="['system:menu:edit']"
          >
            修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-permission="['system:menu:remove']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                style="line-height: normal"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="form.type">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="A">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.type != 'A'">
            <el-form-item label="菜单图标">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <icon-select ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 100%; width: 20px"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="order">
              <el-input-number v-model="form.order" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.type != 'A'">
            <el-form-item prop="routePath">
              <span slot="label">
                <el-tooltip content="访问的路由地址,如:`user`" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.routePath" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.type == 'C'">
            <el-form-item prop="componentPath">
              <span slot="label">
                <el-tooltip
                  content="访问的组件路径,如:`system/user/index`,默认在`views`目录下"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
              <el-input v-model="form.componentPath" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.type != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符,如:`system:user:list`" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="form.type != 'A'">
            <el-form-item>
              <span slot="label">
                <el-tooltip
                  content="选择隐藏则路由将不会出现在侧边栏,但仍然可以访问"
                  placement="top"
                >
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
              <el-radio-group v-model="form.visible">
                <el-radio :label="1">显示</el-radio>
                <el-radio :label="0">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.type != 'A'">
            <el-form-item>
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏,也不能被访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
              <el-radio-group v-model="form.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, addMenu, getMenu, updateMenu, delMenu } from '@/api/system/menu';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import IconSelect from '@/components/IconSelect';

export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    const validRoutePath = (rule, value, callback) => {
      if ((this.form.type === 'M' || this.form.type === 'C') && !value) {
        return callback(new Error('路由地址不能为空'));
      }
      callback();
    };
    const validComponentPath = (rule, value, callback) => {
      if (this.form.type === 'C' && !value) {
        return callback(new Error('组件路径不能为空'));
      }
      callback();
    };
    const validPerms = (rule, value, callback) => {
      if ((this.form.type === 'C' || this.form.type === 'A') && !value) {
        return callback(new Error('权限字符不能为空'));
      }
      callback();
    };
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // // 表单校验
      rules: {
        name: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        order: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        routePath: [{ required: true, validator: validRoutePath, trigger: 'blur' }],
        componentPath: [{ required: true, validator: validComponentPath, trigger: 'blur' }],
        perms: [{ required: true, validator: validPerms, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    // 查询菜单列表
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response, 'id');
        this.loading = false;
      });
    },
    // 转换菜单数据结构
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    // 查询菜单下拉树结构
    getTreeselect() {
      listMenu().then(response => {
        this.menuOptions = [];
        const menu = { id: 0, name: '主类目', children: [] };
        menu.children = this.handleTree(response, 'id');
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: undefined,
        icon: undefined,
        type: 'M',
        order: undefined,
        visible: 1,
        status: 1,
      };
      this.resetForm('form');
    },
    // 搜索按钮操作
    handleQuery() {
      this.getList();
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 展开/折叠操作
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    // 新增按钮操作
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = '添加菜单';
    },
    // 修改按钮操作
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.id).then(response => {
        this.form = response;
        this.open = true;
        this.title = '修改菜单';
      });
    },
    // 提交按钮
    submitForm: function () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMenu(this.form).then(response => {
              this.$modal.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.$modal.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
        .then(function () {
          return delMenu(row.id);
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
