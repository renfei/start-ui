<template>
   <div id="app">
     <editor
       api-key="e62grbji4fg3bqlszl3pi7anrla4sl542hz8h9sr45ze1ux4"
       :init="{
         language:'zh_CN',
         height: 650,
         min_height: 400,
         menubar: true,
         template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
         template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
         autosave_ask_before_unload: false,
         toolbar_mode : 'wrap',
         automatic_uploads : false,
         plugins: [
           'print preview searchreplace autolink directionality',
           'visualblocks visualchars fullscreen image link media',
           'template advcode codesample table charmap hr pagebreak',
           'nonbreaking anchor insertdatetime advlist lists wordcount',
           'imagetools textpattern help emoticons autosave bdmap',
           'indent2em autoresize formatpainter axupimgs importword kityformula-editor',
           'searchreplace visualblocks code fullscreen',
           'insertdatetime media table paste code help wordcount'
         ],
         toolbar:
           'code undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
           styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
           table image media charmap emoticons hr pagebreak insertdatetime print preview | fullscreen | bdmap indent2em lineheight formatpainter axupimgs importword kityformula-editor',
         fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
         font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif'
       }"
     />
   </div>
 </template>

 <script>
 import Editor from '@tinymce/tinymce-vue'

 export default {
   name: 'app',
   components: {
     'editor': Editor
   }
 }
 </script>