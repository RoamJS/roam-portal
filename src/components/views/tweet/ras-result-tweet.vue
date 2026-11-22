<template>
  <div class="ras-tweet-results-container">
    <div
      v-infinite-scroll="loadMoreTweets"
      infinite-scroll-disabled="allTweetsVisible"
      class="ras-results-container"
    >
      <div
        v-for="(blockResult, idx) in blockResults.slice(0, visibleCount)"
        :key="blockResult.blockUid"
        class="ras-result ras-tweet-container"
        @mouseover="onHoverElmIndex = idx"
        @mouseleave="onHoverElmIndex = null"
        @click="navigateToPage($event, blockResult)"
      >
        <TweetCard :key="blockResult.tweet.url" :url="blockResult.tweet.url" />
        <timeAction
          v-if="!('pageTitle' in blockResult)"
          :index="idx"
          :hoveredIndex="onHoverElmIndex"
          :blockResult="blockResult"
        />
        <copyReference
          v-if="blockResult.blockUid"
          :blockUid="blockResult.blockUid"
        />
      </div>
    </div>
  </div>
</template>
<script>
import timeAction from "../../shared/blockActions/timeAction.vue";
import copyReference from "../../shared/blockActions/copyReferenceAction.vue";
import roamAdapter from "../../../adapters/roamAdapter";

import TweetCard from "./TweetCard.vue";

const PAGE_SIZE = 4;

export default {
  name: "ras-result-tweet",
  components: { TweetCard, timeAction, copyReference },
  mixins: [roamAdapter],
  props: { blockResults: Array },
  data() {
    return { onHoverElmIndex: null, visibleCount: PAGE_SIZE };
  },
  computed: {
    allTweetsVisible() {
      return this.visibleCount >= this.blockResults.length;
    },
  },
  watch: {
    blockResults() {
      this.visibleCount = PAGE_SIZE;
    },
  },
  methods: {
    loadMoreTweets() {
      this.visibleCount += PAGE_SIZE;
    },
    navigateToPage(event, result) {
      let uid = result.isPage ? result.pageUid : result.blockUid;

      if (event.shiftKey) {
        this.roamOpenSidebar(uid);
        return true;
      }

      const url = new URL(window.location.href);
      let parts = url.hash.split("/");
      url.hash = parts.slice(0, 3).concat(["page"]).join("/");

      window.location.hash = url.hash + "/" + uid;
      window.roamPortal.hide();
    },
  },
};
</script>
<style scoped>
.ras-results-container {
  height: 100%;
  overflow-y: auto;
}
.ras-tweet-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
}
.ras-tweet-container a {
  overflow-wrap: anywhere;
}
</style>
