<template>
	<div>
		<Calendar />
		<CalendarBar />
		<div>
			<h2 class="leagueTypes">National Leagues</h2>
			<div @click="openGame(countryName)" v-for="(countryName, key) in getLeagues" :key="key">
				<CardCountry :country="countryName" :name="key" :isOpen="getOpenGame(countryName) ? 'isOpen' : ''">
					<div class="align--full" v-if="getOpenGame(countryName)">
						<div v-for="(competition, key) in countryName.league" :key="key">
							<CardLeague :name="key" :league="competition" />
							<CardGame :game="game" v-for="game in competition" :key="game.fixture.id" />
						</div>
					</div>
				</CardCountry>
			</div>
		</div>
		<!-- <a class="clearCacheButton" target="_blank" href="https://api-football-v3.herokuapp.com/api/v3/fixtures/?clearCache=all">Clear Cache</a> -->
	</div>
</template>

<script>
	import { defineComponent, onDeactivated, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed, watch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import axios from "axios";
	import LazyHydrate from "vue-lazy-hydration";

	import useLiveGames from "../modules/useLiveGames";
	import useGamesByDate from "../modules/useGamesByDate";

	export default defineComponent({
		components: {
			LazyHydrate,
			Calendar: () => import("@/components/Calendar/Calendar.vue" /* webpackChunkName: "Calendar" */),
			CalendarBar: () => import("@/components/CalendarBar/CalendarBar.vue" /* webpackChunkName: "Calendar" */),
			CardCountry: () => import("@/components/CardCountry/CardCountry.vue" /* webpackChunkName: "CardCountry" */),
			CardLeague: () => import("@/components/CardLeague/CardLeague.vue" /* webpackChunkName: "CardLeague" */),
			CardGame: () => import("@/components/CardGame/CardGame.vue" /* webpackChunkName: "CardGame" */)
		},
		setup() {
			const getLeagues = ref([]);
			const openGames = ref([]);
			const interval = ref(null);
			const isShown = ref(false);
			const isSelected = ref(false);
			const selectedDate = computed(() => store.getSelectedDate());
			const loading = ref(true);
			const liveToggle = computed(() => store.getLiveToggle());
			const { liveGames, loadLiveGames } = useLiveGames();
			const { games, loadGames } = useGamesByDate();

			const getOpenGame = game => {
				return openGames.value.find(item => item.image == game.image);
			};
			const openGame = countryName => {
				if (openGames.value.includes(countryName)) {
					openGames.value = openGames.value.filter(game => game.image != countryName.image);
				} else {
					openGames.value.push(countryName);
				}
			};

			const toggleLive = () => {
				if (!liveToggle.value) {
					getLeagues.value = games.value;
					return;
				}

				loadLiveGames().then(() => {
					getLeagues.value = liveGames.value;
				});
			};

			const { fetch, fetchState } = useFetch(async () => {
				await loadGames().then(() => {
					getLeagues.value = games.value;
				});
			});

			watch(
				() => [selectedDate.value, liveToggle.value],
				(newValue, prevValue) => {
					const dateHasChanged = newValue[0] != prevValue[0];

					liveToggle.value && !dateHasChanged ? toggleLive() : fetch();
					dateHasChanged ? fetch() : "";
				}
			);

			onMounted(() => {
				fetch();
			});

			onDeactivated(() => {
				clearInterval(interval.value);
			});
			onActivated(() => {
				interval.value = setInterval(() => {
					if (liveToggle.value) {
						loadLiveGames().then(() => {
							getLeagues.value = liveGames.value;
						});
					} else {
						if (new Date().toISOString().split("T")[0] != selectedDate.value) return;
						fetch();
					}
				}, 15000);
			});

			store.setSelectedMatch({});

			return {
				games,
				fetchState,
				getLeagues,
				games,
				openGame,
				openGames,
				isSelected,
				loading,
				liveToggle,
				isShown,
				getOpenGame
			};
		}
	});
</script>

<style lang="scss">
	.clearCacheButton {
		position: absolute;
		top: 50px;
		left: 50px;
		border: 1px solid #212121;
		padding: 8px;
	}

	.leagueTypes {
		font-size: 14px;
		font-weight: 600;
		margin-top: 16px;
		height: 40px;
		padding-left: 32px;
		display: flex;
		align-items: center;
	}
</style>
