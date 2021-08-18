<template>
	<div class="matchOverview" v-if="matchDetail">
		<div class="matchOverview__period" v-for="(periods, name) in reversePeriods" :key="name">
			<h3 class="matchOverview__periodName" v-if="periods.period.includes('first') || periods.period.includes('second')">{{ periods.period }} Half</h3>
			<h3 class="matchOverview__periodName" v-else>{{ periods.period }}</h3>
			<div class="matchOverview__periodTeam">
				<CardEvent v-for="(event, index) in periods.events" :key="index" :event="event" />
			</div>
		</div>
		<!--
		<LazyHydrate when-visible>
			<CardTeamsForm :teamsForm="displayTeamsForm" />
		</LazyHydrate>
		-->
		<CardVenue :venue="displayVenue" />
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, onMounted, onBeforeUnmount } from "@nuxtjs/composition-api";
	import LazyHydrate from "vue-lazy-hydration";
	import store from "@/store.js";
	import CardEvent from "@/components/CardEvent/CardEvent.vue";
	import CardTeamsForm from "@/components/CardTeamsForm/CardTeamsForm.vue";
	import CardVenue from "@/components/CardVenue/CardVenue.vue";

	export default {
		components: {
			LazyHydrate,
			CardEvent,
			CardTeamsForm,
			CardVenue
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const getTeamsFromStandings = computed(() => store.getTeamsFromStandings());
			const displayTeamsForm = computed(() => getTeamsFromStandings?.value?.map(teams => teams.form));

			const displayEvents = computed(() => {
				return props.matchDetail.events?.reduce((acc, event) => {
					let homeTeam = computed(() => props.matchDetail.teams.home);

					if (event.time.elapsed <= 45) acc.first = acc.first || new Set();
					if (event.time.elapsed > 45 && event.time.elapsed <= 90) acc.second = acc.second || new Set();
					if (event.time.elapsed > 90 && event.time.elapsed <= 120 && event.comments !== "Penalty Shootout") acc.overtime = acc.overtime || new Set();
					if (event.comments == "Penalty Shootout") acc.penalty = acc.penalty || new Set();
					Object.defineProperty(event, "side", { value: "", writable: true, enumerable: true, configurable: true });

					if (event.time.elapsed <= 45) {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.first.add(event);
					} else if (event.time.elapsed > 45 && event.time.elapsed <= 90) {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.second.add(event);
					} else if (event.time.elapsed > 90 && event.time.elapsed <= 120 && event.comments !== "Penalty Shootout") {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.overtime.add(event);
					} else if (event.comments == "Penalty Shootout") {
						event.team.id == homeTeam.value.id ? (event["side"] = "home") : (event["side"] = "away");
						acc.penalty.add(event);
					}

					return acc;
				}, {});
			});

			const displayVenue = computed(() => {
				const { date, venue, referee, status } = props.matchDetail.fixture;
				const { name, round } = props.matchDetail.league;
				const getReferee = () => {
					if (status.short == "NS") {
						return referee || "To be defined";
					} else {
						return referee || "";
					}
				};
				return {
					date: new Date(date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric" }),
					tournament: `${name}, ${round}`,
					stadium: `${venue.name ? venue.name + "," + venue.city : ""}`,
					referee: getReferee()
				};
			});
			const reversePeriods = computed(() => {
				return Object.keys(displayEvents?.value)
					.reverse()
					.map(key => {
						const events = Array.from(displayEvents.value[key]);
						events.reverse();

						return {
							period: key,
							events
						};
					});
			});

			return {
				displayEvents,
				reversePeriods,
				displayVenue,
				displayTeamsForm
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchOverview {
		margin-top: 24px;
		margin-bottom: 24px;

		&__period {
			display: grid;
			border: 1px solid #c7c7c7;
			margin-bottom: 16px;
		}
		&__periodName {
			font-size: 14px;
			font-weight: 600;
			text-transform: uppercase;
			padding: 8px 16px;
			background-color: #dadada;
			grid-column: 1/-1;
		}
	}
</style>
