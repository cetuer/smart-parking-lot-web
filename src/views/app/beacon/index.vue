<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" v-show="showSearch" label-width="90px">
            <el-row>
                <el-col :span="5">
                    <el-form-item label="物理地址" prop="mac">
                        <el-input
                            v-model="queryParams.mac"
                            placeholder="请输入物理地址"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="uuid" prop="uuid">
                        <el-input
                            v-model="queryParams.priceStandard"
                            placeholder="请输入uuid"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="主要标识" prop="major">
                        <el-input
                            v-model.number="queryParams.major"
                            placeholder="输入主要标识"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="次要标识" prop="minor">
                        <el-input
                            v-model.number="queryParams.minor"
                            placeholder="输入次要标识"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
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
                    v-permission="['app:beacon:add']"
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
                    v-permission="['app:beacon:edit']"
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
                    v-permission="['app:beacon:remove']"
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

        <el-table v-loading="loading" :data="beaconList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
                label="信标编号"
                align="center"
                key="id"
                prop="id"
                v-if="columns[0].visible"
            />
            <el-table-column
                label="物理地址"
                align="center"
                key="mac"
                prop="mac"
                :show-overflow-tooltip="true"
                v-if="columns[1].visible"
            />
            <el-table-column
                label="uuid"
                align="center"
                key="uuid"
                prop="uuid"
                :show-overflow-tooltip="true"
                v-if="columns[2].visible"
            />
            <el-table-column
                label="主要标识"
                align="center"
                key="major"
                prop="major"
                v-if="columns[3].visible"
            />
            <el-table-column
                label="次要标识"
                align="center"
                key="minor"
                prop="minor"
                v-if="columns[4].visible"
            />
            <el-table-column
                label="x坐标"
                align="center"
                key="x"
                prop="x"
                sortable
                v-if="columns[5].visible"
            />
            <el-table-column
                label="y坐标"
                align="center"
                key="y"
                prop="y"
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
                        v-permission="['app:beacon:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-permission="['app:beacon:remove']"
                    >
                        删除
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

        <!-- 添加或修改信标配置对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            :close-on-click-modal="false"
            width="600px"
            append-to-body
        >
            <el-form ref="form" :model="form" status-icon :rules="rules" label-width="80px">
                <el-form-item label="停车场" prop="parkingLotId">
                    <el-select v-model="form.parkingLotId" placeholder="请选择">
                        <el-option
                            v-for="item in parkingOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物理地址" prop="mac">
                    <el-input v-model="form.mac" placeholder="请输入物理地址" />
                </el-form-item>
                <el-form-item label="uuid" prop="uuid">
                    <el-input v-model="form.uuid" placeholder="请输入uuid" />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="主要标识" prop="major">
                            <el-input
                                v-model="form.major"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                placeholder="请输入主要标识"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="次要标识" prop="minor">
                            <el-input
                                v-model="form.minor"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                placeholder="请输入次要标识"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="x坐标" prop="x">
                            <el-input
                                v-model="form.x"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                placeholder="请输入x坐标"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="y坐标" prop="y">
                            <el-input
                                v-model="form.y"
                                oninput="value=value.replace(/[^\d]/g,'')"
                                placeholder="请输入y坐标"
                            />
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
import { list } from '@/api/app/parking';
import { listBeacon, add, getBeacon, update, del } from '@/api/app/beacon';
export default {
    name: 'Beacon',
    data() {
        return {
            //停车场编号
            parkingId: 0,
            // 显示搜索条件
            showSearch: true,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // 信标表格数据
            beaconList: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 停车场选项
            parkingOptions: [],
            // 表单参数
            form: {},
            // 列信息
            columns: [
                { key: 0, label: `信标编号`, visible: true },
                { key: 1, label: `物理地址`, visible: true },
                { key: 2, label: `uuid`, visible: true },
                { key: 3, label: `主要标识`, visible: true },
                { key: 4, label: `次要标识`, visible: true },
                { key: 5, label: `x坐标`, visible: true },
                { key: 6, label: `y坐标`, visible: true },
                { key: 7, label: `创建时间`, visible: true },
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                mac: undefined,
                uuid: undefined,
                major: undefined,
                minor: undefined,
            },
            // 表单校验
            rules: {
                parkingLotId: [{ required: true, message: '停车场不能为空', trigger: 'blur' }],
                mac: [{ required: true, message: '物理地址不能为空', trigger: 'blur' }],
                x: [{ required: true, message: 'x坐标不能为空', trigger: 'blur' }],
                y: [{ required: true, message: 'y坐标不能为空', trigger: 'blur' }],
            },
        };
    },
    created() {
        this.parkingId = this.$route.params && this.$route.params.parkingId;
        this.getList();
    },
    methods: {
        // 查找信标列表
        getList() {
            this.loading = true;
            this.queryParams.parkingLotId = this.parkingId;
            listBeacon(this.queryParams).then(res => {
                this.beaconList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.form.parkingLotId =
                this.parkingId === undefined ? undefined : parseInt(this.parkingId);
            list().then(response => {
                this.parkingOptions = response;
                this.open = true;
                this.title = '添加信标';
            });
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            list().then(response => {
                this.parkingOptions = response;
            });
            getBeacon(row.id || this.ids).then(response => {
                this.form = response;
                this.open = true;
                this.title = '修改信标';
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
                .confirm('是否确认删除信标编号为' + (row.id || this.ids) + '的数据项？')
                .then(() => {
                    return del(row.id || this.ids);
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
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
                mac: undefined,
                uuid: undefined,
                major: undefined,
                minor: undefined,
                parkingLotId: undefined,
                x: undefined,
                y: undefined,
                available: 1,
            };
            this.resetForm('form');
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
    },
};
</script>
