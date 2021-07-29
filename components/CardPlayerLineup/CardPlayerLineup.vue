<template>
	<div class="cardPlayerLineup" v-if="player">
		<nuxt-img v-if="player.photo" class="cardPlayerLineup__playerPhoto" width="24" height="24" :src="player.photo" :alt="player.name + ' photo'" />
		<span class="cardPlayerLineup__playerNumber" v-if="player.number">{{ player.number }}</span>
		<span class="cardPlayerLineup__playerName" v-if="player.name">{{ player.name }}</span>
		<span class="cardPlayerLineup__playerMatchEvent">Coach</span>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import store from "@/store.js";

	export default {
		props: {
			player: {
				type: Object
			}
		},
		setup(props) {
			console.log(props.player);
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardPlayerLineup {
		display: grid;
		font-weight: 600;
		grid-template-columns: 40px 1fr auto;
		gap: 0 10px;

		&__playerName {
			width: 100%;
		}
	}
</style>
