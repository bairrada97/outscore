<template>
	<div class="matchDetail">
		<MatchInfo :match="selectedMatch" />

		<MatchTabsWrapper>
			<MatchTab title="Overview"><MatchOverview v-if="getSelectedTab == 'Overview' && Object.keys(selectedMatch).length > 0 && standings.length > 0" :matchDetail="selectedMatch" /> </MatchTab>
			<MatchTab title="Lineups"><MatchLineups v-if="getSelectedTab == 'Lineups'" :matchDetail="selectedMatch" /> </MatchTab>
			<MatchTab title="Stats"><MatchStatistics v-if="getSelectedTab == 'Stats'" :matchDetail="selectedMatch" /></MatchTab>
			<MatchTab title="Bets Helper"><MatchBetsHelper v-if="getSelectedTab == 'Bets Helper'" :matchDetail="selectedMatch" /></MatchTab>
			<MatchTab title="H2H"><MatchH2H v-if="getSelectedTab == 'H2H'" :matchDetail="selectedMatch" /></MatchTab>
			<MatchTab title="Standings"><MatchStandings v-if="getSelectedTab == 'Standings'" :matchDetail="selectedMatch" /></MatchTab>
		</MatchTabsWrapper>
	</div>
</template>

<script>
	import { reactive, toRefs, ref, computed, useFetch, useContext, onActivated, onMounted, onDeactivated, watch, onUnmounted } from "@nuxtjs/composition-api";

	import store from "@/store.js";
	import axios from "axios";
	import useMatchesById from "@/modules/useMatchesById";
	import useStandings from "@/modules/useStandings";

	import MatchTabsWrapper from "@/components/MatchTabsWrapper/MatchTabsWrapper.vue";
	import MatchTab from "@/components/MatchTab/MatchTab.vue";
	import MatchInfo from "@/components/MatchInfo/MatchInfo.vue";
	import MatchOverview from "@/components/MatchOverview/MatchOverview.vue";
	import MatchStatistics from "@/components/MatchStatistics/MatchStatistics.vue";
	import MatchH2H from "@/components/MatchH2H/MatchH2H.vue";
	import MatchBetsHelper from "@/components/MatchBetsHelper/MatchBetsHelper.vue";
	import MatchStandings from "@/components/MatchStandings/MatchStandings.vue";
	import MatchLineups from "@/components/MatchLineups/MatchLineups.vue";

	export default {
		components: {
			MatchInfo,
			MatchOverview,
			MatchTabsWrapper,
			MatchTab,
			MatchStatistics,
			MatchH2H,
			MatchBetsHelper,
			MatchStandings,
			MatchLineups
		},

		setup() {
			const { query } = useContext();
			const { selectedMatch, loadMatchById } = useMatchesById();
			const { loadStandings } = useStandings();
			const getSelectedTab = computed(() => store.getSelectedTab());
			const standings = computed(() => store.getStandings());
			const interval = ref(null);

			const { fetch, fetchState } = useFetch(async () => {
				await loadMatchById(parseInt(query.value.fixture));
				await loadStandings(selectedMatch.value, selectedMatch.value.league.season);
			});
			watch(
				() => parseInt(query.value.fixture),
				(newValue, prevValue) => {
					if (!parseInt(query.value.fixture)) return;

					fetch();
				}
			);

			onDeactivated(() => {
				clearInterval(interval.value);
				document.removeEventListener("visibilitychange", fetch);
			});

			onActivated(() => {
				document.addEventListener("visibilitychange", fetch);
				interval.value = setInterval(() => {
					fetch();
				}, 15000);
			});

			onMounted(() => {
				fetch();
				document.addEventListener("visibilitychange", fetch);
			});

			return {
				selectedMatch,
				fetchState,
				getSelectedTab,
				standings
			};
		}
	};
</script>

<style lang="scss"></style>
