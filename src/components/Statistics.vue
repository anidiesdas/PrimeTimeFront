<template>
  <div class="welcome-wrapper">
    <router-link to="/">
      <img src="@/assets/profile.png" alt="Profilbild" class="profile-pic" />
    </router-link>    <div class="welcome-text">
    <h1>🤓 Statistics</h1>
  </div>
  </div>

  <HallOfStats />
  <hr class="custom-line" />
  <AverageRatingOverTime/>
  <GenreDistribution/>
  <PlatformDistribution/>
  <MemberMovieCount/>

</template>

<script setup>
import HallOfStats from "@/components/under/HallOfStats.vue"
import AverageRatingOverTime from "@/components/charts/AverageRatingOverTime.vue";
import GenreDistribution from "@/components/charts/GenreDistribution.vue";
import PlatformDistribution from "@/components/charts/PlatformDistribution.vue";
import MemberMovieCount from "@/components/charts/MemberMovieCount.vue";
</script>

<style>
</style>