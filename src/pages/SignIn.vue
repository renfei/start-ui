<template>
  <v-app id="signIn">
    <v-card
        :width="width"
        :height="height"
        :loading="loading"
        outlined
        style="margin: auto;">
      <v-overlay
          absolute
          opacity="0.1"
          :value="overlay">
      </v-overlay>
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
            v-show="show_account_container"
            fluid>
          <v-row cols="12">
            <v-col
                cols="12"
                class="text-center">
              <h2>{{ $t("lang.sign_in") }}</h2>
              <p>{{ $t("lang.use_your") }} RENFEI.NET {{ $t("lang.account") }}</p>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12">
              <v-form
                  ref="form"
                  v-model="valid.username"
              >
                <v-text-field
                    :label="this.$t('lang.user_name')"
                    :rules="rules_account"
                    v-model="form.username"
                    prepend-inner-icon="mdi-account-circle"
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
                  class="pl-0 pr-0 text-capitalize"
              >
                {{ $t("lang.create_account") }}
              </v-btn>
            </v-col>
            <v-col
                cols="6"
                class="text-right">
              <v-btn
                  color="primary"
                  class="text-capitalize"
                  @click="next_account"
              >
                {{ $t("lang.next") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container
            id="password_container"
            v-show="show_password_container"
            fluid>
          <v-row cols="12">
            <v-col
                cols="12"
                class="text-center">
              <h2>{{ $t("lang.welcome") }}</h2>
              <v-btn
                  rounded
                  depressed
                  class="text-capitalize"
                  @click="back_username"
              >
                <v-icon left>
                  mdi-account-circle
                </v-icon>
                {{ form.username }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12">
              <v-form
                  ref="form"
                  v-model="valid.password"
              >
                <v-text-field
                    :label="this.$t('lang.password')"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    :rules="rules_password"
                    @click:append="showPassword = !showPassword"
                    v-model="form.password"
                    prepend-inner-icon="mdi-lock"
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
                  class="pl-0 pr-0 text-capitalize"
              >
                {{ $t("lang.forgot_password") }}
              </v-btn>
            </v-col>
            <v-col
                cols="6"
                class="text-right text-capitalize">
              <v-btn
                  color="primary"
                  class="text-capitalize"
                  @click="next_password"
              >
                {{ $t("lang.next") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-container
            id="tow_step_container"
            v-show="show_2fa_container"
            fluid>
          <v-row cols="12">
            <v-col
                cols="12"
                class="text-center">
              <h2>{{ $t("lang.two_factor_authentication") }}</h2>
              <v-btn
                  rounded
                  depressed
                  class="text-capitalize"
                  @click="back_username"
              >
                <v-icon left>
                  mdi-account-circle
                </v-icon>
                {{ form.username }}
              </v-btn>
            </v-col>
          </v-row>
          <v-row cols="12">
            <v-col cols="12">
              <v-form
                  ref="form"
                  v-model="valid.code2fa"
              >
                <v-text-field
                    :label="this.$t('lang._2fa')"
                    :rules="rules_2fa"
                    type="text"
                    counter="6"
                    maxlength="6"
                    v-model="form.code2fa"
                    prepend-inner-icon="mdi-counter"
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
            </v-col>
            <v-col
                cols="6"
                class="text-right text-capitalize">
              <v-btn
                  color="primary"
                  class="text-capitalize"
                  @click="next_2fa"
              >
                {{ $t("lang.next") }}
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
                :items="locale"
                v-model="this.$i18n.locale"
                menu-props="auto"
                label="Select"
                hide-details
                single-line
                @change="lang_change"
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
import locale from '@/libs/locale';
import encryption from "@/libs/encryption";
import {getLocalStore, setSessionStore} from '@/util/Storage';
import {signIn} from '@/api/start/auth';

export default {
  name: 'signIn',
  data() {
    return {
      overlay: false,
      showPassword: false,
      e1: 'zh-CN',
      locale: locale.list(),
      show_account_container: true,
      show_password_container: false,
      show_2fa_container: false,
      loading: false,
      valid: {
        username: false,
        password: false,
        code2fa: false,
      },
      form: {
        username: "i@renfei.net",
        password: "password",
        code2fa: "123456",
      },
      rules_account: [
        v => !!v || this.$t('lang.required'),
      ],
      rules_password: [
        v => !!v || this.$t('lang.required'),
      ],
      rules_2fa: [
        v => !!v || this.$t('lang.required'),
        v => v.length <= 6 || this.$t('lang.required') + ' 6 ' + this.$t('lang.characters'),
      ],
    }
  },
  beforeCreate() {
    utils.loadTheme(this);
  },
  methods: {
    setTheme() {
      utils.theme(this);
    },
    lang_change(any) {
      locale.setLocale(any);
      this.$i18n.locale = getLocalStore('locale');
    },
    next_account() {
      this.card_loading();
      if (this.valid.username) {
        this.show_account_container = false;
        this.show_password_container = true;
      }
      this.card_un_loading();
    },
    next_password() {
      this.card_loading();
      if (this.valid.password) {
        this.doSignIn();
      } else {
        this.card_un_loading();
      }
    },
    next_2fa() {
      this.card_loading();
      if (this.valid.password) {
        this.doSignIn();
      }
      this.card_un_loading();
    },
    back_username() {
      this.show_account_container = true;
      this.show_password_container = false;
      this.show_password_container = false;
      this.show_2fa_container = false;
      this.form.username = "";
      this.form.password = "";
      this.form.code2fa = "";
    },
    card_loading() {
      this.overlay = true;
      this.loading = true;
    },
    card_un_loading() {
      this.overlay = false;
      this.loading = false;
    },
    doSignIn() {
      encryption.aesEncrypt(this.form.password).then(val => {
        //登陆
        let params = {
          userName: this.form.username,
          password: val.content,
          keyId: val.KeyId,
          tOtp: this.form.code2fa,
          useVerCode: false
        };
        signIn(params).then(res => {
          if (res.code === 200) {
            setSessionStore('accessToken', res.data.token);
            this.$router.push({name: 'home'});
          } else if (res.code === 402) {
            this.card_un_loading();
            this.show_account_container = false;
            this.show_password_container = false;
            this.show_2fa_container = true;
          } else {
            this.card_un_loading();
            this.$message.error(res.message);
          }
        });
      });
    },
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