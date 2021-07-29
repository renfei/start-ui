<template>
  <v-snackbar
      top
      v-model="snackbar"
      multi-line
      app
      timeout="6000"
      :color="color"
  >
    <template>
      <v-icon>
        {{ icon }}
      </v-icon>
    </template>
    {{ text }}
    <template
        v-slot:action="{attrs}"
    >
      <v-btn
          v-bind="attrs"
          text
          @click="snackbar=false"
      >
        {{ btn_text }}
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import i18n from '@/i18n/i18n';

export default {
  data() {
    return {
      snackbar: false,
      text: "",
      icon: "",
      color: "",
      btn_text: i18n.t("lang.close"),
    }
  },
  methods: {
    show(text, color, icon) {
      this.snackbar = true;
      this.text = text;
      this.color = color;
      this.icon = icon;
      this.btn_text = i18n.t("lang.close");
    },
  },
}
</script>