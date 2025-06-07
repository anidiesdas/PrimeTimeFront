<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>🤓 Statistics</h1>
  </div>
  </div>

  <AverageRatingOverTime/>

</template>

<script setup>
import AverageRatingOverTime from '@/components/charts/AverageRatingOverTime.vue'
</script>

<!--TODO genre verteilung pie chart-->
<!--TODO ratings nach genre-->
<!--TODO bewertungen pro nutzer (anzahl)-->
<!--TODO plattformnutzung-->