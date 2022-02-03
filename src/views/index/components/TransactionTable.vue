<template>
  <el-table :data="list" style="width: 100%; padding-top: 15px">
    <el-table-column label="Order_No" min-width="200">
      <template slot-scope="scope">
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">¥{{ scope.row.price | toThousandFilter }}</template>
    </el-table-column>
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{ row }">
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const defaultList = [
  {
    order_no: 'A97C6dd7-73b7-22E5-5997-86e142',
    price: 8701.6,
    status: 'success',
  },
  {
    order_no: 'dC99C4eF-A88e-6EB4-3ecF-ce18Fb',
    price: 7614.9,
    status: 'success',
  },
  {
    order_no: '215C6bfc-fA17-EA6d-b3C1-344f8a',
    price: 8317.1,
    status: 'pending',
  },
  {
    order_no: 'BCFf7cDF-A5FB-ee1b-4E0B-804cF0',
    price: 13415.8,
    status: 'success',
  },
  {
    order_no: 'ec3Fe2De-47f4-Ed5a-8Cec-A01b01',
    price: 2518.3,
    status: 'pending',
  },
  {
    order_no: 'Ab4dB5c8-6BA8-C608-8Fc5-Bc2D2B',
    price: 14312.2,
    status: 'pending',
  },
  {
    order_no: '747beFc5-5Cf6-B488-FABa-ee9EFd',
    price: 10079.2,
    status: 'success',
  },
  {
    order_no: 'Af5E31eb-9Bb1-41BD-8dE5-f42CbA',
    price: 5378.8,
    status: 'pending',
  },
];

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger',
      };
      return statusMap[status];
    },
    toThousandFilter(num) {
      return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
    },
    orderNoFilter(str) {
      return str.substring(0, 30);
    },
  },
  data() {
    return {
      list: null,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.list = defaultList;
    },
  },
};
</script>
