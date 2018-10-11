<template>
    <div id="settlement">
      <div id="title" v-title data-title="结算中心"></div>
    </div>
</template>

<script>
    export default {
        name: "settlement"
    }
</script>

<style scoped>
   #settlement{
     position: absolute;
     top:1.3rem;
     bottom:0;
     height: auto;
     width:100%;
     background-color: #f6f6f6;
   }
</style>
