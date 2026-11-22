<template>
  <div class="ras-tweet-card" @click.stop>
    <div ref="mount"></div>
    <a v-if="failed" :href="url" target="_blank" rel="noopener noreferrer">
      {{ url }}
    </a>
  </div>
</template>

<script>
export default {
  name: "TweetCard",
  props: { url: { type: String, required: true } },
  data() {
    return { failed: false };
  },
  mounted() {
    const el = this.$refs.mount;
    const components = window.roamAlphaAPI.ui.components;
    this.rendered = Promise.resolve()
      .then(() => components.renderString({ el, string: this.url }))
      .catch(() => {
        this.failed = true;
      });
  },
  beforeDestroy() {
    const el = this.$refs.mount;
    this.rendered.then(() =>
      window.roamAlphaAPI.ui.components.unmountNode({ el })
    );
  },
};
</script>

<style scoped>
.ras-tweet-card {
  flex-basis: 100%;
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
