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
        <div
            v-for="(next,i) in menu"
            :key="i"
        >
          <v-list-item
              v-if="next.child==null"
              link
          >
            <v-list-item-icon>
              <v-icon>{{ next.menuIcon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title @click="clickMenu(next.menuLink)">{{ next.menuName }}</v-list-item-title>
          </v-list-item>
          <v-list-group
              v-if="next.child!=null"
              :value="true"
          >
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>{{ next.menuIcon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title @click="clickMenu(next.menuLink)">{{ next.menuName }}</v-list-item-title>
            </template>
            <div
                v-for="(next2,i2) in next.child"
                :key="i2"
            >
              <v-list-item
                  v-if="next2.child==null"
                  link
              >
                <v-list-item-icon>
                  <v-icon>{{ next2.menuIcon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title @click="clickMenu(next2.menuLink)">{{ next2.menuName }}</v-list-item-title>
              </v-list-item>
              <v-list-group
                  v-if="next2.child!=null"
                  :value="true"
                  no-action
                  sub-group
              >
                <template v-slot:activator>
                  <v-list-item-title @click="clickMenu(next2.menuLink)">{{ next2.menuName }}</v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>{{ next2.menuIcon }}</v-icon>
                  </v-list-item-icon>
                </template>
                <v-list-item
                    v-for="(next3,i3) in next2.child"
                    :key="i3"
                    link
                >
                  <v-list-item-icon>
                    <v-icon>{{ next3.menuIcon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title @click="clickMenu(next3.menuLink)">{{ next3.menuName }}</v-list-item-title>
                </v-list-item>
              </v-list-group>
            </div>
          </v-list-group>
        </div>
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
import {getSysMenu} from '@/api/start/sys'

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
    menu: [],
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
    clickMenu: function (link) {
      if (link !== null && link !== undefined && link !== "") {
        this.$router.push(link);
      }
    },
  },
  mounted: function () {
    myInfo().then(res => {
      watermark.set(res.data.userName, res.data.email)
    });
    getSysMenu().then(res => {
      this.menu = res.data;
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
