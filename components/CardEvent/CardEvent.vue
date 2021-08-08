<template>
	<div class="cardEvent" v-if="event" :data-side="event.side">
		<span class="cardEvent__time">{{ event.time.elapsed }}'</span>
		<img class="cardEvent__icon" :src="getEventIcon(event.detail)" />
		<div class="cardEvent__playerContainer">
			<span class="cardEvent__playerName">
				{{ event.player.name }}
				<span class="cardEvent__assistName" v-if="!event.player.id && event.comments == 'Not on pitch'">(Coach)</span>
			</span>
			<span class="cardEvent__assistName" v-if="event.assist.name">{{ event.assist.name }}</span>
			<span class="cardEvent__assistName" v-if="event.type == 'Var'">{{ event.detail }}</span>
			<span class="cardEvent__assistName" v-if="event.comments">{{ event.comments }}</span>
		</div>
	</div>
</template>

<script>
	import { watch, computed, ref } from "@nuxtjs/composition-api";
	import useCalendar from "../../modules/useCalendar";
	import store from "@/store.js";

	export default {
		props: {
			event: {
				type: Object
			}
		},
		setup(props) {
			const { event } = props;
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
					case "Substitution 1":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 2":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 3":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 4":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 5":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 6":
						return require("~/assets/icons/event__sub.svg");
					case "Substitution 7":
						return require("~/assets/icons/event__sub.svg");
					case "Goal Cancelled":
						return require("~/assets/icons/event__cardRed.svg");
					case "Penalty Confirmed":
						return require("~/assets/icons/event__penaltyGoal.svg");
					case "Goal Disallowed - offside":
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
	.cardEvent {
		display: grid;
		grid-template-columns: auto auto 1fr auto;
		align-items: center;
		padding: 8px 16px;
		box-shadow: inset 0px -1px 0px rgba(183, 183, 183, 0.3);
		height: 56px;
		gap: 0 16px;
		font-size: 14px;
		font-weight: 600;

		&[data-side="home"] {
			background: #f7f7f7;
		}

		&[data-side="away"] {
			direction: rtl;
		}

		&__time {
			color: #939393;
		}

		&__playerContainer {
			display: flex;
			flex-direction: column;
		}

		&__assistName {
			font-size: 12px;
			font-weight: 400;
			color: #797979;
		}
	}
</style>
