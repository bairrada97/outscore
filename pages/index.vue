<template>
	<div>
		<LazyHydrate when-idle>
			<Calendar />
		</LazyHydrate>
		<CalendarBar />
		<div class="leagueContainer">
			<div class="align--full">
				<h2 class="leagueTypes">Favorite Leagues</h2>
				<div v-for="(competition, key) in getFavoriteLeagues" :key="key" class="favoriteLeagues">
					<CardLeague :name="competition[0].league.name" :league="competition" />
					<CardGame :game="game" v-for="game in competition" :key="game.fixture.id" />
				</div>
			</div>
		</div>

		<div class="leagueContainer">
			<h2 class="leagueTypes">National Leagues</h2>
			<div @click="openGame($event, countryName)" v-for="(countryName, key) in getLeagues" :key="key">
				<LazyHydrate when-visible>
					<CardCountry :country="countryName" :name="key" :isOpen="getOpenGame(countryName) ? 'isOpen' : ''">
						<div class="align--full" v-if="getOpenGame(countryName)">
							<div v-for="(competition, key) in countryName.league" :key="key">
								<CardLeague :name="key" :league="competition" />
								<CardGame :game="game" v-for="game in competition" :key="game.fixture.id" />
							</div>
						</div>
					</CardCountry>
				</LazyHydrate>
			</div>
		</div>
	</div>
</template>

<script>
	import { defineComponent, onDeactivated, ref, onMounted, useFetch, onActivated, computed, watch, nextTick } from "@nuxtjs/composition-api";
	import store from "@/store.js";
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
			const favoriteLeaguesID = ref([94, 39, 140, 135, 61, 78]);

			const getFavoriteLeagues = computed(() => {
				return Object.values(getLeagues.value)
					?.map(country => Object.values(country.league))
					.flat(1)
					.filter(item => item.find(league => favoriteLeaguesID.value.includes(league.league.id)));
			});

			console.log(getFavoriteLeagues);

			const getOpenGame = game => openGames.value.find(item => item.country == game.country);
			const openGame = ({ currentTarget }, countryName) => {
				const offset = -45;
				if (openGames.value.includes(countryName)) {
					openGames.value = openGames.value.filter(game => game.country != countryName.country);

					window.scrollTo({ top: currentTarget.getBoundingClientRect().top + window.pageYOffset + offset });
				} else {
					openGames.value.push(countryName);
					setTimeout(() => {
						window.scrollTo({ top: currentTarget.getBoundingClientRect().top + window.pageYOffset + offset, behavior: "smooth" });
					}, 5);
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

			const fetchOnBrowserVisibility = () => {
				if (document.visibilityState == "hidden") {
					clearInterval(interval.value);
				} else {
					if (liveToggle.value) {
						loadLiveGames().then(() => {
							getLeagues.value = liveGames.value;
						});
					} else {
						if (new Date().toISOString().split("T")[0] != selectedDate.value) return;
						fetch();
					}
					clearInterval(interval.value);
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
				}
			};

			onDeactivated(() => {
				clearInterval(interval.value);
				document.removeEventListener("visibilitychange", fetchOnBrowserVisibility);
			});
			onActivated(() => {
				fetch();
				document.addEventListener("visibilitychange", fetchOnBrowserVisibility);

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

			watch(
				() => [selectedDate.value, liveToggle.value],
				(newValue, prevValue) => {
					const dateHasChanged = newValue[0] != prevValue[0];
					openGames.value = [];
					liveToggle.value && !dateHasChanged ? toggleLive() : fetch();
					dateHasChanged ? fetch() : "";
				}
			);

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
				getOpenGame,
				getFavoriteLeagues
			};
		}
	});
</script>

<style lang="scss">
	.leagueContainer {
		&:last-of-type {
			margin-bottom: 55px;
		}
	}
	.leagueTypes {
		font-size: 14px;
		font-weight: 600;
		margin-top: 16px;
		height: 40px;
		padding-left: 16px;
		display: flex;
		align-items: center;
	}

	.favoriteLeagues {
		border: 1px solid rgba(183, 183, 183, 0.3);
		&:not(:last-of-type) {
			margin-bottom: 8px;
		}
	}
</style>
