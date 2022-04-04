<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    v-permission="['app:space:add']"
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
                    v-permission="['app:space:edit']"
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
                    v-permission="['app:space:remove']"
                >
                    删除
                </el-button>
            </el-col>
        </el-row>

        <el-table v-loading="loading" :data="spaceList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
                label="车位编号"
                align="center"
                key="id"
                prop="id"
                v-if="columns[0].visible"
            />
            <el-table-column
                label="车牌号"
                align="center"
                key="carId"
                prop="carId"
                v-if="columns[1].visible"
            />
            <el-table-column
                label="x坐标"
                align="center"
                key="x"
                prop="x"
                sortable
                v-if="columns[2].visible"
            />
            <el-table-column
                label="y坐标"
                align="center"
                key="y"
                prop="y"
                sortable
                v-if="columns[3].visible"
            />
            <el-table-column
                label="车位状态"
                align="center"
                key="available"
                v-if="columns[4].visible"
            >
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.available === 1">可用</el-tag>
                    <el-tag type="danger" v-else>不可用</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                align="center"
                prop="createTime"
                v-if="columns[5].visible"
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
                        v-permission="['app:space:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-permission="['app:space:remove']"
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

        <!-- 添加或修改停车位配置对话框 -->
        <el-dialog
            :title="title"
            :visible.sync="open"
            :close-on-click-modal="false"
            width="600px"
            append-to-body
        >
            <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px">
                <el-form-item v-show="form.id !== undefined" label="车牌号" prop="carId">
                    <el-input v-model="form.carId" placeholder="请输入车牌号" maxlength="30" />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="x坐标" prop="x">
                            <el-input v-model.number="form.x" placeholder="请输入x坐标" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="y坐标" prop="y">
                            <el-input v-model.number="form.y" placeholder="请输入y坐标" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item v-show="form.id !== undefined" label="车位状态">
                    <el-radio-group v-model="form.available">
                        <el-radio :label="1">可用</el-radio>
                        <el-radio :label="0">不可用</el-radio>
                    </el-radio-group>
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
import { listSpace, add, getSpace, update, del } from '@/api/app/space';
export default {
    name: 'Parking',
    data() {
        return {
            //停车场编号
            parkingId: 0,
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
            // 停车场表格数据
            spaceList: null,
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            // 列信息
            columns: [
                { key: 0, label: `车位编号`, visible: true },
                { key: 1, label: `车牌号`, visible: true },
                { key: 2, label: `x坐标`, visible: true },
                { key: 3, label: `y坐标`, visible: true },
                { key: 4, label: `车位状态`, visible: true },
                { key: 5, label: `创建时间`, visible: true },
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                parkingId: 0,
            },
            // 表单校验
            rules: {
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
        // 查找车位列表
        getList() {
            this.loading = true;
            this.queryParams.parkingId = this.parkingId;
            listSpace(this.queryParams).then(res => {
                this.spaceList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加车位';
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            getSpace(row.id || this.ids).then(response => {
                this.form = response;
                this.open = true;
                this.title = '修改车位';
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
                .confirm('是否确认删除车位编号为' + (row.id || this.ids) + '的数据项？')
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
                parkingLotId: this.parkingId,
                carId: undefined,
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
        // 更多操作
        handleCommand(command, row) {
            switch (command) {
                case 'handleDelAllSpace':
                    this.handleDelAllSpace(row);
                    break;
                case 'handleSpace':
                    this.handleSpace(row);
                    break;
                default:
                    break;
            }
        },
    },
};
</script>
