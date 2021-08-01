<template>
	<div class="cardPlayerLineup" v-if="player">
		<nuxt-img v-if="player.photo" class="cardPlayerLineup__playerPhoto" width="24" height="24" :src="player.photo" :alt="player.name + ' photo'" />
		<span class="cardPlayerLineup__playerNumber" v-if="player.number">{{ player.number }}</span>
		<span class="cardPlayerLineup__playerName" v-if="player.name">{{ player.name }}</span>
		<div v-if="events"><img v-for="(event, index) in events" :key="index" :src="getEventIcon(event.detail)" /></div>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import store from "@/store.js";

	export default {
		props: {
			player: {
				type: Object
			},
			events: {
				type: Array
			}
		},
		setup(props) {
			const { events } = props;

			const getEventIcon = typeDetail => {
				switch (typeDetail) {
					case "Normal Goal":
						return require("~/assets/icons/event__goal.svg");
					case "Own Goal":
						return require("~/assets/icons/event__owngoal.svg");
					case "Penalty":
						return require("~/assets/icons/event__penaltyGoal.svg");
					case "Missed Penalty":
						return require("~/assets/icons/event__penaltyMissed.svg");
					case "Yellow Card":
						require("~/assets/icons/event__cardYellow.svg");
					case "Second Yellow Card":
						return require("~/assets/icons/event__cardYellow.svg");
					case "Red Card":
						return require("~/assets/icons/event__cardRed.svg");
					case "Goal Cancelled":
						return require("~/assets/icons/event__cardRed.svg");
					case "Penalty Confirmed":
						return require("~/assets/icons/event__penaltyGoal.svg");
				}
			};

			return {
				getEventIcon
			};
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
