<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="停车场名称" prop="name">
                        <el-input
                            v-model="queryParams.name"
                            placeholder="请输入停车场名称"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="收费标准" prop="priceStandard">
                        <el-input
                            v-model="queryParams.priceStandard"
                            placeholder="请输入收费标准(元/小时)"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
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
                    v-permission="['app:parking:add']"
                    @click="handleAdd"
                >
                    新增
                </el-button>
            </el-col>
            <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList"
                :columns="columns"
            ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="parkingList">
            <el-table-column
                label="停车场编号"
                align="center"
                key="id"
                prop="id"
                v-if="columns[0].visible"
            />
            <el-table-column
                label="停车场名称"
                align="center"
                key="name"
                prop="name"
                :show-overflow-tooltip="true"
                v-if="columns[1].visible"
            />
            <el-table-column
                label="经度"
                align="center"
                key="longitude"
                prop="longitude"
                :show-overflow-tooltip="true"
                v-if="columns[2].visible"
            />
            <el-table-column
                label="纬度"
                align="center"
                key="latitude"
                prop="latitude"
                :show-overflow-tooltip="true"
                v-if="columns[3].visible"
            />
            <el-table-column
                label="车位总数"
                align="center"
                key="carportCount"
                prop="carportCount"
                sortable
                v-if="columns[4].visible"
            />
            <el-table-column
                label="空余车位"
                align="center"
                key="emptyParking"
                prop="emptyParking"
                sortable
                v-if="columns[5].visible"
            />
            <el-table-column
                label="收费标准(元/小时)"
                align="center"
                key="priceStandard"
                prop="priceStandard"
                width="160px"
                sortable
                v-if="columns[6].visible"
            />
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                v-if="columns[7].visible"
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
                        v-permission="['app:parking:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-permission="['app:parking:remove']"
                    >
                        删除
                    </el-button>
                    <el-dropdown
                        size="mini"
                        @command="command => handleCommand(command, scope.row)"
                    >
                        <span class="el-dropdown-link">
                            <i class="el-icon-d-arrow-right el-icon--right"></i>
                            更多
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleDelAllSpace" icon="el-icon-delete-solid" v-permission="['app:space:remove']">
                                删除所有车位
                            </el-dropdown-item>
                            <el-dropdown-item command="handleAuthRole" icon="el-icon-s-grid" v-permission="['app:space:list']">
                                操作车位
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

        <!-- 添加或修改停车场配置对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            :close-on-click-modal="false"
            width="600px"
            append-to-body
        >
            <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px">
                <el-form-item label="停车场名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入停车场名称" />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="经度" prop="longitude">
                            <el-input
                                v-model="form.longitude"
                                placeholder="请输入经度"
                                oninput="value=value.replace(/[^\d.]/g,'')"
                                maxlength="10"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="纬度" prop="latitude">
                            <el-input
                                v-model="form.latitude"
                                placeholder="请输入纬度"
                                oninput="value=value.replace(/[^\d.]/g,'')"
                                maxlength="10"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="收费标准(元/小时)" prop="priceStandard" label-width="140px">
                    <el-input
                        v-model="form.priceStandard"
                        placeholder="请输入收费标准"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                    />
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
import { listParking, add, getParking, update, del } from '@/api/app/parking';
import {delAll} from '@/api/app/space';
export default {
    name: 'Parking',
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 停车场表格数据
            parkingList: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            // 列信息
            columns: [
                { key: 0, label: `停车场编号`, visible: true },
                { key: 1, label: `停车场名称`, visible: true },
                { key: 2, label: `经度`, visible: true },
                { key: 3, label: `纬度`, visible: true },
                { key: 4, label: `车位总数`, visible: true },
                { key: 5, label: `空余车位`, visible: true },
                { key: 6, label: `收费标准`, visible: true },
                { key: 7, label: `创建时间`, visible: true },
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: undefined,
                priceStandard: undefined,
            },
            // 表单校验
            rules: {
                name: [{ required: true, message: '停车场名称不能为空', trigger: 'blur' }],
                longitude: [{ required: true, message: '停车场经度不能为空', trigger: 'blur' }],
                latitude: [{ required: true, message: '停车场纬度不能为空', trigger: 'blur' }],
                priceStandard: [
                    { required: true, message: '停车场收费标准不能为空', trigger: 'blur' },
                ],
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        // 查找停车场列表
        getList() {
            this.loading = true;
            listParking(this.queryParams).then(res => {
                this.parkingList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加停车场';
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            getParking(row.id).then(response => {
                this.form = response;
                this.open = true;
                this.title = '修改停车场';
            });
        },
        // 提交按钮操作
        submitForm() {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    if (this.form.id != undefined) {
                        update(this.form).then(response => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        add(this.form).then(response => {
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
            this.$modal
                .confirm('是否确认删除停车场编号为' + row.id + '的数据项？')
                .then(() => {
                    return del(row.id);
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
                name: undefined,
                longitude: undefined,
                latitude: undefined,
                priceStandard: undefined,
            };
            this.resetForm('form');
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 更多操作
        handleCommand(command, row) {
            switch (command) {
                case 'handleDelAllSpace':
                    this.handleDelAllSpace(row);
                    break;
                case 'handleAuthRole':
                    this.handleAuthRole(row);
                    break;
                default:
                    break;
            }
        },
        // 删除此停车场所有车位
        handleDelAllSpace(row) {
            this.$modal
                .confirm('是否确认删除此停车场所有车位？请谨慎操作！')
                .then(() => {
                    return delAll(row.id);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {});
        },
        // 分配角色
        handleAuthRole: function (row) {
            const userId = row.id;
            this.$router.push('/system/user-auth/role/' + userId);
        },
    },
};
</script>
