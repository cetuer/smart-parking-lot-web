<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="用户名称" prop="username">
                        <el-input
                            v-model="queryParams.username"
                            placeholder="请输入用户名称"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号码" prop="phone">
                        <el-input
                            v-model="queryParams.phone"
                            placeholder="请输入手机号码"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="状态" prop="status">
                        <el-select
                            v-model="queryParams.status"
                            placeholder="会员状态"
                            clearable
                            size="small"
                        >
                            <el-option label="正常" value="1" />
                            <el-option label="停用" value="0" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            size="mini"
                            @click="handleQuery"
                        >
                            搜索
                        </el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">
                            重置
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    v-permission="['app:member:add']"
                    @click="handleAdd"
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
                    v-permission="['app:member:edit']"
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
                    v-permission="['app:member:remove']"
                >
                    删除
                </el-button>
            </el-col>
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
                :columns="columns"
            ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
                label="会员编号"
                align="center"
                key="id"
                prop="id"
                v-if="columns[0].visible"
            />
            <el-table-column
                label="用户名称"
                align="center"
                key="username"
                prop="username"
                :show-overflow-tooltip="true"
                v-if="columns[1].visible"
            />
            <el-table-column
                label="会员昵称"
                align="center"
                key="nickname"
                prop="nickname"
                :show-overflow-tooltip="true"
                v-if="columns[2].visible"
            />
            <el-table-column
                label="手机号码"
                align="center"
                key="phone"
                prop="phone"
                v-if="columns[3].visible"
            />
            <el-table-column label="状态" align="center" key="status" v-if="columns[4].visible">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.status === 1">正常</el-tag>
                    <el-tag type="danger" v-else>停用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="性别" align="center" key="gender" v-if="columns[5].visible">
                <template slot-scope="scope">
                    <el-tag type="info" v-if="!scope.row.gender">未知</el-tag>
                    <el-tag v-if="scope.row.gender === 1">男</el-tag>
                    <el-tag type="warning" v-if="scope.row.gender === 2">女</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                v-if="columns[6].visible"
                width="170"
            />
            <el-table-column
                label="操作"
                align="center"
                width="170"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(scope.row)"
                        v-permission="['app:member:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-permission="['app:member:remove']"
                    >
                        删除
                    </el-button>
                    <el-dropdown
                        size="mini"
                        @command="command => handleCommand(command, scope.row)"
                        v-permission="['system:user:edit']"
                    >
                        <span class="el-dropdown-link">
                            <i class="el-icon-d-arrow-right el-icon--right"></i>
                            更多
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleResetPwd" icon="el-icon-key">
                                重置密码
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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

        <!-- 添加或修改会员配置对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            :close-on-click-modal="false"
            width="600px"
            append-to-body
        >
            <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.id == undefined" label="用户名称" prop="username">
                            <el-input
                                v-model="form.username"
                                placeholder="请输入用户名称"
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.id == undefined" label="用户密码" prop="password">
                            <el-input
                                v-model="form.password"
                                placeholder="请输入用户密码"
                                type="password"
                                maxlength="20"
                                show-password
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="会员昵称" prop="nickname">
                            <el-input
                                v-model="form.nickname"
                                placeholder="请输入会员昵称"
                                maxlength="30"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="phone">
                            <el-input
                                v-model="form.phone"
                                placeholder="请输入手机号码"
                                maxlength="11"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-radio-group v-model="form.gender">
                                <el-radio :label="0">未知</el-radio>
                                <el-radio :label="1">男</el-radio>
                                <el-radio :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="状态">
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
import {
    listMemberByPage,
    getMember,
    addMember,
    delMember,
    updateMember,
    checkUsernameUnique,
    resetMemberPwd,
} from '@/api/app/member';
export default {
    name: 'Member',
    data() {
        const validatorUsername = (rule, value, callback) => {
            checkUsernameUnique(value).then(res => {
                if (!res) {
                    callback(new Error('用户名已存在'));
                }
                callback();
            });
        };
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 显示搜索条件
            showSearch: true,
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 用户表格数据
            memberList: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            // 列信息
            columns: [
                { key: 0, label: `会员编号`, visible: true },
                { key: 1, label: `用户名称`, visible: true },
                { key: 2, label: `会员昵称`, visible: true },
                { key: 3, label: `手机号码`, visible: true },
                { key: 4, label: `状态`, visible: true },
                { key: 5, label: `性别`, visible: true },
                { key: 6, label: `创建时间`, visible: true },
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                username: undefined,
                phone: undefined,
                status: undefined,
            },
            // 表单校验
            rules: {
                username: [
                    { required: true, message: '用户名称不能为空', trigger: 'blur' },
                    {
                        min: 2,
                        max: 20,
                        message: '用户名称长度必须介于 2 和 20 之间',
                        trigger: 'blur',
                    },
                    { validator: validatorUsername, trigger: 'blur' },
                ],
                nickname: [{ required: true, message: '会员昵称不能为空', trigger: 'blur' }],
                password: [
                    { required: true, message: '用户密码不能为空', trigger: 'blur' },
                    {
                        min: 5,
                        max: 20,
                        message: '用户密码长度必须介于 5 和 20 之间',
                        trigger: 'blur',
                    },
                ],
                phone: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: '请输入正确的手机号码',
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 查找会员列表
        getList() {
            this.loading = true;
            listMemberByPage(this.queryParams).then(res => {
                this.memberList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加会员';
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            const memberId = row.id || this.ids;
            getMember(memberId).then(response => {
                this.form = response;
                this.form.password = '';
                this.open = true;
                this.title = '修改会员信息';
            });
        },
        // 提交按钮操作
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        updateMember(this.form).then(response => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addMember(this.form).then(response => {
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
            const ids = row.id || this.ids;
            this.$modal
                .confirm('是否确认删除会员编号为' + ids + '的数据项？')
                .then(() => {
                    return delMember(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {});
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
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
                username: undefined,
                nickname: undefined,
                password: undefined,
                phone: undefined,
                status: 1,
                gender: 0,
            };
            this.resetForm('form');
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
        // 更多操作
        handleCommand(command, row) {
            switch (command) {
                case 'handleResetPwd':
                    this.handleResetPwd(row);
                    break;
                default:
                    break;
            }
        },
        // 重置密码
        handleResetPwd(row) {
            this.$prompt('请输入"' + row.username + '"的新密码', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                inputPattern: /^.{5,20}$/,
                inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
            })
                .then(({ value }) => {
                    resetMemberPwd(row.id, value).then(response => {
                        this.$modal.msgSuccess('修改成功，新密码是：' + value);
                    });
                })
                .catch(() => {});
        },
    },
};
</script>
