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
        <v-toolbar-title>{{ $t("lang.menu_management") }}</v-toolbar-title>
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
                        v-model="editedItem.menuName"
                        label="菜单名称"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <v-text-field
                        v-model="editedItem.menuLink"
                        label="菜单链接"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="6"
                  >
                    <v-text-field
                        v-model="editedItem.menuIcon"
                        label="菜单图标"
                    ></v-text-field>
                  </v-col>

                  <v-col
                      cols="12"
                      sm="12"
                      md="6"
                  >
                    <v-select
                        v-model="editedItem.isNewWindow"
                        label="是否新窗口打开"
                        :items="isNewWindow"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="4"
                      md="6"
                  >
                    <v-text-field
                        v-model="editedItem.parentId"
                        label="父级ID"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="4"
                      md="6"
                  >
                    <v-text-field
                        v-model="editedItem.orderNum"
                        label="排序编号"
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
    <template v-slot:no-data>
      {{ $t("lang.no_data") }}
    </template>
    <template v-slot:item.menuIcon="{ item }">
      <v-icon
          small
          class="mr-2"
      >
        {{ item.menuIcon }}
      </v-icon>
    </template>
    <template v-slot:item.isNewWindow="{ item }">
      {{ item.isNewWindow ? $t("lang.yes") : $t("lang.no") }}
    </template>
  </v-data-table>
</template>

<script>
import i18n from '@/i18n/i18n';
import {
  getAllMenu,
  editSysMenu,
  deleteSysMenu
} from '@/api/start/sys'

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
      {text: "ID", value: 'id',},
      {text: i18n.t("lang.menu_icon"), value: 'menuIcon'},
      {text: i18n.t("lang.menu_name"), value: 'menuName',},
      {text: i18n.t("lang.menu_link"), value: 'menuLink'},
      {text: i18n.t("lang.is_new_window"), value: 'isNewWindow'},
      {text: i18n.t("lang.parent_id"), value: 'parentId'},
      {text: i18n.t("lang.order_num"), value: 'orderNum'},
      {text: i18n.t("lang.actions"), value: 'actions'},
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      id: null,
      menuName: '',
      menuLink: '',
      orderNum: '0',
      menuIcon: '',
      isNewWindow: false,
      parentId: null,
    },
    defaultItem: {
      id: null,
      menuName: '',
      menuLink: '',
      orderNum: '0',
      menuIcon: '',
      isNewWindow: false,
      parentId: null,
    },
    isNewWindow: [
      {text: i18n.t("lang.yes"), value: true},
      {text: i18n.t("lang.no"), value: false},
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
      getAllMenu(params).then(res => {
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
      deleteSysMenu({
        id: this.editedItem.id
      }).then(res => {
        if (res.code === 200) {
          this.initialize();
        } else {
          this.$message.error(res.message);
        }
        this.closeDelete()
      });
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
      editSysMenu(this.editedItem).then(res => {
        if (res.code === 200) {
          this.initialize();
        } else {
          this.$message.error(res.message);
        }
        this.close()
      });
    },
  },
}
</script>

<style scoped>

</style>