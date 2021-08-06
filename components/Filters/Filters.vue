<template>
	<div class="filters" v-show="title == selectedFilter">
		<slot />
	</div>
</template>

<script>
	import { defineComponent, provide, inject, ref, onMounted, useFetch, onActivated, computed, watch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import axios from "axios";

	export default defineComponent({
		props: ["title"],
		setup(props, { slots }) {
			const selectedFilter = inject("selectedFilter");

			return {
				selectedFilter
			};
		}
	});
</script>

<style lang="scss">
	.filters {
	}
</style>
