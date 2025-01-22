<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Card 1</v-card-title>
          <v-card-text>
            Schedule Area
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Card 2</v-card-title>
          <v-card-text>
            Schedule Area
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script setup>

</script>
  
<style scoped>
.v-container {
  margin-top: 80px;
}

@media (max-width: 768px) {
  .v-col {
    margin-bottom: 16px;
  }
}
</style>