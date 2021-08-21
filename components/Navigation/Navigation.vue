<template>
	<nav class="navigation">
		<nuxt-link class="navigation__item" :to="item.url" v-for="(item, index) in navigation" :key="index">
			<nuxt-img v-if="item.icon" class="navigation__icon" width="24" height="24" :src="item.icon" :alt="item.name + ' logo'" />
			<span>{{ item.name }}</span>
		</nuxt-link>
	</nav>
</template>

<script>
	import { defineComponent, reactive, inject, ref, onMounted, useFetch, onActivated, computed, watch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import axios from "axios";

	export default defineComponent({
		setup() {
			const navigation = reactive([
				{
					name: "Matches",
					icon: require("~/assets/icons/navMatches.svg"),
					url: "/"
				},
				{
					name: "Leagues",
					icon: require("~/assets/icons/navLeagues.svg"),
					url: "/leagues"
				},
				{
					name: "Following",
					icon: require("~/assets/icons/navFollowing.svg"),
					url: "/followin"
				},
				{
					name: "My Games",
					icon: require("~/assets/icons/navMygames.svg"),
					url: "/mygames"
				}
			]);
			return {
				navigation
			};
		}
	});
</script>

<style lang="scss">
	.navigation {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		position: fixed;
		bottom: 0;
		background: #ffffff;
		box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
		z-index: 99;
		align-items: center;
		width: 100%;
		max-width: 450px;

		&__item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 8px 0;
			font-weight: 600;
			font-size: 12px;
			line-height: 15px;
			text-align: center;
			text-transform: uppercase;

			&.nuxt-link-exact-active {
				color: #609b15;
			}
		}
	}
</style>
