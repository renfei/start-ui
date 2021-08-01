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
        <v-toolbar-title>{{ $t("lang.role_management") }}</v-toolbar-title>
        <v-divider
            class="mx-4"
            inset
            vertical
        ></v-divider>
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
                        v-model="editedItem.roleName"
                        label="角色名称"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <v-text-field
                        v-model="editedItem.roleEnName"
                        label="角色英文名称"
                    ></v-text-field>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="6"
                  >
                    <v-select
                        v-model="editedItem.isBuiltIn"
                        label="是否系统内置"
                        disabled
                        :items="isBuiltIn"
                    ></v-select>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <h2 class="text-h6 mb-2">
                      {{$t("lang.api_permission")}}
                    </h2>
                    <v-chip-group
                        v-model="editedItem.myApiPermissionIndex"
                        column
                        multiple
                    >
                      <v-chip
                          filter
                          outlined
                          v-for="(ApiPermission,i) in allApiPermission"
                          :key="i"
                      >
                        {{ ApiPermission.resourceName }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                  <v-col
                      cols="12"
                      sm="12"
                      md="12"
                  >
                    <h2 class="text-h6 mb-2">
                      {{$t("lang.menu_permission")}}
                    </h2>
                    <v-chip-group
                        v-model="editedItem.myMenuPermissionIndex"
                        column
                        multiple
                    >
                      <v-chip
                          filter
                          outlined
                          v-for="(ApiPermission,i) in allMenuPermission"
                          :key="i"
                      >
                        {{ ApiPermission.resourceName }}
                      </v-chip>
                    </v-chip-group>
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
    <template v-slot:item.isBuiltIn="{ item }">
      {{ item.isBuiltIn ? $t("lang.yes") : $t("lang.no") }}
    </template>
  </v-data-table>
</template>

<script>
import i18n from '@/i18n/i18n';
import {
  getAllRole,
  editSysRole,
  deleteSysRole
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
      {text: i18n.t("lang.menu_name"), value: 'roleName',},
      {text: i18n.t("lang.menu_link"), value: 'roleEnName'},
      {text: i18n.t("lang.is_new_window"), value: 'isBuiltIn'},
      {text: i18n.t("lang.actions"), value: 'actions'},
    ],
    desserts: [],
    editedIndex: -1,
    allApiPermission: [],
    allMenuPermission: [],
    editedItem: {
      id: null,
      roleName: '',
      roleEnName: '',
      isBuiltIn: false,
      myMenuPermission: [],
      myMenuPermissionIndex: [],
      myApiPermission: [],
      myApiPermissionIndex: [],
      permissionUuid: [],
    },
    defaultItem: {
      id: null,
      roleName: '',
      roleEnName: '',
      isBuiltIn: false,
      myMenuPermission: [],
      myMenuPermissionIndex: [],
      myApiPermission: [],
      myApiPermissionIndex: [],
      permissionUuid: [],
    },
    isBuiltIn: [
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
      getAllRole(params).then(res => {
        console.log(res);
        this.desserts = res.data.listData.data;
        this.allApiPermission = res.data.allApiPermission;
        this.allMenuPermission = res.data.allMenuPermission;
        this.options.serverItemsLength = res.data.listData.total;
        this.loading = false;
      });
    },

    // 分组、排序项改变，重新向后端请求数据
    optionsChanged() {
      this.initialize();
    },

    editItem(item) {
      this.editedItem.myApiPermissionIndex = [];
      this.editedItem.myMenuPermissionIndex = [];
      this.editedItem.permissionUuid = [];
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      let tempApiData = [], tempMenuData = [];
      for (let i = 0; i < this.allApiPermission.length; i++) {
        for (let j = 0; j < item.myApiPermission.length; j++) {
          if (this.allApiPermission[i].uuid === item.myApiPermission[j].uuid) {
            tempApiData.push(i);
            this.editedItem.myApiPermissionIndex = tempApiData;
            break;
          }
        }
      }
      for (let i = 0; i < this.allMenuPermission.length; i++) {
        for (let j = 0; j < item.myMenuPermission.length; j++) {
          if (this.allMenuPermission[i].uuid === item.myMenuPermission[j].uuid) {
            tempMenuData.push(i);
            this.editedItem.myMenuPermissionIndex = tempMenuData;
            break;
          }
        }
      }
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      deleteSysRole({
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
      let tempData = [];
      for (let i = 0; i < this.editedItem.myApiPermissionIndex.length; i++) {
        tempData.push(this.allApiPermission[i].uuid);
      }
      for (let i = 0; i < this.editedItem.myMenuPermissionIndex.length; i++) {
        tempData.push(this.allMenuPermission[i].uuid);
      }
      this.editedItem.permissionUuid = tempData;
      editSysRole(this.editedItem).then(res => {
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