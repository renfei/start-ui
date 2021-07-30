<template>
  <v-app id="Console">
    <v-navigation-drawer
        app
        v-model="drawer">
      <v-app-bar
          flat>
        <v-toolbar-title>StartUI</v-toolbar-title>
      </v-app-bar>
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-group
            :value="true"
            prepend-icon="mdi-account-circle"
        >
          <template v-slot:activator>
            <v-list-item-title>Users</v-list-item-title>
          </template>

          <v-list-group
              :value="true"
              no-action
              sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Admin</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
                v-for="([title, icon], i) in admins"
                :key="i"
                link
            >
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group
              no-action
              sub-group
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>Actions</v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
                v-for="([title, icon], i) in cruds"
                :key="i"
                link
            >
              <v-list-item-icon>
                <v-icon v-text="icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="title"></v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        app
        flat>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-menu
          open-on-hover
          offset-y
          close-on-content-click
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              v-bind="attrs"
              v-on="on"
              icon
          >
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list
            nav
            dense
        >
          <v-list-item-group
              v-model="langSelectedItem"
          >
            <v-list-item
                v-for="(item, index) in locale"
                :key="index"
            >
              <v-list-item-content>
                <v-list-item-title @click="lang_change(item.value)">{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-btn icon @click="setTheme">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-menu
          open-on-hover
          offset-y
          close-on-content-click
      >
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
              v-bind="attrs"
              v-on="on"
              class="hidden-sm-and-down"
              color="grey darken-1 shrink"
              size="32"
          >
            霏
          </v-avatar>
        </template>
          <v-list
              nav
              dense
          >
            <v-list-item-group
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Menu1</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Menu2</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset></v-divider>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Menu3</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view v-if="isRouterAlive"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import utils from '@/util/Utils';
import watermark from '@/util/WarterMark'
import {getLocalStore, getSessionStore} from '@/util/Storage';
import {myInfo} from '@/api/start/auth';
import locale from "@/libs/locale";

export default {
  name: 'Console',

  data: () => ({
    isRouterAlive: true,
    langSelectedItem: {},
    avatarSelectedItem: {},
    locale: locale.list(),
    drawer: null,
    admins: [
      ['Management', 'mdi-account-multiple-outline'],
      ['Settings', 'mdi-cog-outline'],
    ],
    cruds: [
      ['Create', 'mdi-plus-outline'],
      ['Read', 'mdi-file-outline'],
      ['Update', 'mdi-update'],
      ['Delete', 'mdi-delete'],
    ],
  }),
  beforeCreate() {
    utils.loadTheme(this);
    let token = getSessionStore("accessToken");
    if (token == null || token === undefined || token === "") {
      this.$router.push({name: 'signIn'});
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  methods: {
    setTheme() {
      utils.theme(this);
    },
    lang_change(any) {
      locale.setLocale(any);
      this.$i18n.locale = getLocalStore('locale');
      this.reload();
    },
    reload: function () {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
  mounted: function () {
    myInfo().then(res => {
      watermark.set(res.data.userName, res.data.email)
    });
  },
  beforeDestroy() {
    watermark.set('', '')
  }

};
</script>

<style>
* {
  font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", "Microsoft YaHei", STXihei, STHeiti, Heiti, SimSun, sans-serif;
}
</style>
