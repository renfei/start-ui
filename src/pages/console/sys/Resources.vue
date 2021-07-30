<template>
  <v-data-table
      :headers="headers"
      :items="desserts"
      :loading="loading"
      :loading-text="this.$t('lang.loading')"
      :options.sync="options"
      @update:options="optionsChanged"
      :server-items-length="options.serverItemsLength"
      item-key="id"
      disable-sort
      class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar
          flat
      >
        <v-toolbar-title>{{ $t("lang.resource_management") }}</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
        <v-alert
            dense
            border="left"
            type="warning"
            class="mt-4"
        >
          {{ $t("lang.resource_alert") }}
        </v-alert>
        <v-spacer></v-spacer>

        <v-dialog
            v-model="dialog"
            max-width="500px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="primary"
                dark
                depressed
                class="mb-2"
                v-bind="attrs"
                v-on="on"
            >
              {{ $t("lang.new_item") }}
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <v-text-field
                        v-model="editedItem.resourceName"
                        label="资源名称"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-select
                        v-model="editedItem.resourceType"
                        label="资源类型"
                        :items="resource_type_items"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="6"
                      md="4"
                  >
                    <v-select
                        v-model="editedItem.requestMethod"
                        label="请求方式"
                        :items="request_method_items"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <v-text-field
                        v-model="editedItem.resourceUrl"
                        label="资源地址"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
              >
                {{ $t("lang.cancel") }}
              </v-btn>
              <v-btn
                  color="blue darken-1"
                  text
                  @click="save"
              >
                {{ $t("lang.save") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">{{ $t("lang.delete_alert") }}</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">{{ $t("lang.cancel") }}</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">{{ $t("lang.ok") }}</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
          small
          @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:item.resourceType="{ item }">
      <v-icon
          small
          class="mr-2"
      >
        {{ item.resourceType }}
      </v-icon>
    </template>
    <template v-slot:no-data>
      {{ $t("lang.no_data") }}
    </template>
  </v-data-table>
</template>

<script>
import i18n from '@/i18n/i18n';
import {getAllPermissionList} from '@/api/start/sys'

export default {
  data: () => ({
    loading: true,
    dialog: false,
    dialogDelete: false,
    options: {
      page: 1,
      itemsPerPage: 10,
      pageStart: 1,
      pageStop: 1,
      serverItemsLength: 0,
    },
    headers: [
      {text: i18n.t("lang.resource_name"), value: 'resourceName',},
      {text: i18n.t("lang.resource_type"), value: 'resourceType'},
      {text: i18n.t("lang.request_method"), value: 'requestMethod'},
      {text: i18n.t("lang.resource_url"), value: 'resourceUrl'},
      {text: i18n.t("lang.actions"), value: 'actions'},
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: -1,
      resourceName: '',
      resourceType: 'API',
      requestMethod: 'GET',
      resourceUrl: '',
    },
    defaultItem: {
      id: -1,
      resourceName: '',
      resourceType: 'API',
      requestMethod: 'GET',
      resourceUrl: '',
    },
    resource_type_items: [
      {text: i18n.t("lang.api"), value: "API"},
      {text: i18n.t("lang.menu"), value: "MENU"},
      {text: i18n.t("lang.button"), value: "BUTTON"},
    ],
    request_method_items: [
      {text: "GET", value: "GET"},
      {text: "POST", value: "POST"},
      {text: "PUT", value: "PUT"},
      {text: "DELETE", value: "DELETE"},
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? this.$t("lang.new_item") : this.$t("lang.edit_item")
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.loading = true;
      let params = {};
      params.page = this.options.page;
      params.rows = this.options.itemsPerPage;
      getAllPermissionList(params).then(res => {
        console.log(res);
        this.desserts = res.data.data;
        this.options.serverItemsLength = res.data.total;
        this.loading = false;
      });
    },

    // 分组、排序项改变，重新向后端请求数据
    optionsChanged() {
      this.initialize();
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>

<style scoped>

</style>