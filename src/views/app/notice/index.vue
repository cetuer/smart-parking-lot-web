<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="停车场" prop="parkingLotId">
                        <el-select
                            v-model="queryParams.parkingLotId"
                            placeholder="请选择"
                            size="mini"
                        >
                            <el-option
                                v-for="item in parkingOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
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
                    v-permission="['app:notice:add']"
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
                    v-permission="['app:notice:edit']"
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
                    v-permission="['app:notice:remove']"
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

        <el-table v-loading="loading" :data="noticeList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
                label="公告编号"
                align="center"
                key="id"
                prop="id"
                v-if="columns[0].visible"
            />
            <el-table-column
                label="标题"
                align="center"
                key="title"
                prop="title"
                :show-overflow-tooltip="true"
                v-if="columns[1].visible"
            />
            <el-table-column
                label="内容"
                align="center"
                key="content"
                prop="content"
                :show-overflow-tooltip="true"
                v-if="columns[2].visible"
            />
            <el-table-column label="是否展示" align="center" key="show" v-if="columns[3].visible">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.show === 1">展示</el-tag>
                    <el-tag type="danger" v-else>不展示</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="级别" align="center" key="level" v-if="columns[4].visible">
                <template slot-scope="scope">
                    <el-tag type="warning" v-if="scope.row.level === 1">紧急</el-tag>
                    <el-tag type="danger" v-else-if="scope.row.level === 2">特急</el-tag>
                    <el-tag v-else>普通</el-tag>
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
                        v-permission="['app:notice:edit']"
                    >
                        修改
                    </el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(scope.row)"
                        v-permission="['app:notice:remove']"
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
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入公告标题" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input
                        type="textarea"
                        v-model="form.content"
                        placeholder="请输入公告内容"
                        maxlength="200"
                        show-word-limit
                        :rows="5"
                    />
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="是否展示" prop="show">
                            <el-radio-group v-model="form.show">
                                <el-radio :label="1">展示</el-radio>
                                <el-radio :label="0">不展示</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公告级别" prop="level">
                            <el-select v-model="form.level" placeholder="请选择">
                                <el-option label="普通" :value="0" />
                                <el-option label="紧急" :value="1" />
                                <el-option label="特急" :value="2" />
                            </el-select>
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
import { listNotice, add, getNotice, update, del } from '@/api/app/notice';
export default {
    name: 'Notice',
    data() {
        return {
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
            // 公告表格数据
            noticeList: null,
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
                { key: 0, label: `公告编号`, visible: true },
                { key: 1, label: `标题`, visible: true },
                { key: 2, label: `内容`, visible: true },
                { key: 3, label: `是否展示`, visible: true },
                { key: 4, label: `级别`, visible: true },
                { key: 5, label: `创建时间`, visible: true },
            ],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                parkingLotId: undefined,
            },
            // 表单校验
            rules: {
                parkingLotId: [{ required: true, message: '停车场不能为空', trigger: 'blur' }],
                title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
                content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }],
                show: [{ required: true, message: '展示状态不能为空', trigger: 'blur' }],
                level: [{ required: true, message: '公告级别不能为空', trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
        list().then(response => {
            this.parkingOptions = response;
        });
    },
    methods: {
        // 查找公告列表
        getList() {
            this.loading = true;
            listNotice(this.queryParams).then(res => {
                this.noticeList = res.rows;
                this.total = res.total;
                this.loading = false;
            });
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = '添加公告';
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            getNotice(row.id || this.ids).then(response => {
                this.form = response;
                this.open = true;
                this.title = '修改公告';
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
                .confirm('是否确认删除公告编号为' + (row.id || this.ids) + '的数据项？')
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
                parkingLotId: undefined,
                title: undefined,
                content: undefined,
                show: 1,
                level: 0,
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
<style>
.el-textarea__inner {
    resize: none;
}
</style>