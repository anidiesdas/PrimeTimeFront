<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>🤓 Statistics</h1>
  </div>
  </div>

  <AverageRatingOverTime/>
  <GenreDistribution/>
  <RatingByGenre/>
  <PlatformDistribution/>

</template>

<script setup>
import AverageRatingOverTime from "@/components/charts/AverageRatingOverTime.vue";
import GenreDistribution from "@/components/charts/GenreDistribution.vue";
import RatingByGenre from "@/components/Charts/RatingByGenre.vue";
import PlatformDistribution from "@/components/Charts/PlatformDistribution.vue";

</script>

<style>
</style>
<!--TODO bewertungen pro nutzer (anzahl)-->
<!--TODO plattformnutzung-->