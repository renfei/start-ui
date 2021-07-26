<template>
  <v-app id="signIn">
    <v-card
        :width="width"
        :height="height"
        outlined
        style="margin: auto;">
      <v-container
          fluid
          class="pa-10">
        <v-row cols="12">
          <v-col
              cols="12"
              class="text-center">
            <img
                width="50"
                height="50"
                src="https://cdn.renfei.net/Logo/RF.svg"/>
          </v-col>
        </v-row>
        <v-container
            id="username_container"
            fluid>
          <v-row cols="12">
            <v-col
                cols="12"
                class="text-center">
              <h2>Sign in</h2>
              <p>Use your RENFEI.NET Account</p>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12">
              <v-form>
                <v-text-field
                    label="UserName"
                    required
                    outlined
                    clearable
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col
                cols="6">
              <v-btn
                  text
                  color="primary"
                  class="pl-0 pr-0"
              >
                创建账户
              </v-btn>
            </v-col>
            <v-col
                cols="6"
                class="text-right">
              <v-btn
                  color="primary"
              >
                下一步
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container
            id="password_container"
            fluid>
          <v-row cols="12">
            <v-col
                cols="12"
                class="text-center">
              <h2>Welcome</h2>
              <v-btn
                  rounded
                  depressed
              >
                <v-icon left>
                  mdi-account-circle
                </v-icon>
                renfei
              </v-btn>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12">
              <v-form>
                <v-text-field
                    label="Password"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    @click:append="showPassword = !showPassword"
                    required
                    outlined
                    clearable
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col
                cols="6">
              <v-btn
                  text
                  color="primary"
                  class="pl-0 pr-0"
              >
                忘记密码
              </v-btn>
            </v-col>
            <v-col
                cols="6"
                class="text-right">
              <v-btn
                  color="primary"
              >
                登 录
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
      <v-card-actions>
        <v-row cols="12">
          <v-col
              cols="6">
            <v-select
                v-model="e1"
                :items="states"
                menu-props="auto"
                label="Select"
                hide-details
                prepend-icon="mdi-translate"
                single-line
            ></v-select>
          </v-col>
          <v-col
              cols="6"
              class="text-right">
            <v-btn
                icon
                class="mt-3"
                @click="setTheme">
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
<script>
import utils from '@/util/Utils';

export default {
  name: 'signIn',
  data() {
    return {
      showPassword: false,
      e1: 'zh-CN',
      states: [
        {
          text: '简体中文',
          value: 'zh-CN'
        }
      ],
    }
  },
  beforeCreate() {
    utils.loadTheme(this);
  },
  methods:{
    setTheme(){
      utils.theme(this);
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    width() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
        case 'md':
        case 'lg':
        case 'xl':
          return 448
      }
    },
    // eslint-disable-next-line vue/return-in-computed-property
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return '100%'
        case 'sm':
        case 'md':
        case 'lg':
        case 'xl':
          return 'auto'
      }
    },
  },
}
</script>