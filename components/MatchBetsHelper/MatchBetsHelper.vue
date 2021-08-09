<template>
	<div class="matchBetsHelper">
		<FiltersWrapper v-if="betsHelperResponse.value">
			<Filters title="Last 5 games">
				<CardBetsBoard v-if="getBoardInfo" :matchDetail="matchDetail" :getBoardInfo="getBoardInfo" title="Last 5 games" type="All"></CardBetsBoard>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('Full Time')" v-if="getSelectedFilter == 'Last 5 games'">
					<CardBetsHelper name="Full Time" :isOpen="getOpenTeamLineup('Full Time') ? 'isOpen' : ''">
						<ul class="matchBetsHelper__list" v-if="getOpenTeamLineup('Full Time')">
							<!-- <span>{{ extraInfo }}</span> -->
							<li class="matchBetsHelper__item" v-for="(category, index) in betsHelper" :key="index">
								<h3 class="matchBetsHelper__title">{{ index }}</h3>
								<div class="matchBetsHelper__stats" v-for="(subCategory, index) in category" :key="index">
									<CardStats :statistics="subCategory" :team="index" :lastGamesLength="lastGamesLength" />
								</div>
							</li>
						</ul>
					</CardBetsHelper>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('First Half')" v-if="getSelectedFilter == 'Last 5 games'">
					<CardBetsHelper name="First Half" :isOpen="getOpenTeamLineup('First Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('Second half')" v-if="getSelectedFilter == 'Last 5 games'">
					<CardBetsHelper name="Second half" :isOpen="getOpenTeamLineup('Second Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
			</Filters>
			<Filters title="H2H">
				<CardBetsBoard v-if="getBoardInfo" :matchDetail="matchDetail" :getBoardInfo="getBoardInfoH2H" title="H2H - Last 5 games" type="H2H"></CardBetsBoard>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('Full Time')" v-if="getSelectedFilter == 'H2H'">
					<CardBetsHelper name="Full Time" :isOpen="getOpenTeamLineup('Full Time') ? 'isOpen' : ''">
						<ul class="matchBetsHelper__list" v-if="getOpenTeamLineup('Full Time')">
							<!-- <span>{{ extraInfo }}</span> -->
							<li class="matchBetsHelper__item" v-for="(category, index) in betsHelper" :key="index">
								<h3 class="matchBetsHelper__title">{{ index }}</h3>
								<div class="matchBetsHelper__stats" v-for="(subCategory, index) in category" :key="index">
									<CardStats :statistics="subCategory" :team="index" :lastGamesLength="lastGamesLength" />
								</div>
							</li>
						</ul>
					</CardBetsHelper>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('First Half')" v-if="getSelectedFilter == 'H2H'">
					<CardBetsHelper name="First Half" :isOpen="getOpenTeamLineup('First Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('Second half')" v-if="getSelectedFilter == 'H2H'">
					<CardBetsHelper name="Second half" :isOpen="getOpenTeamLineup('Second Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
			</Filters>
			<Filters title="Facts"> </Filters>
		</FiltersWrapper>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import CardStats from "@/components/CardStats/CardStats.vue";
	import CardBetsHelper from "@/components/CardBetsHelper/CardBetsHelper.vue";
	import CardBetsBoard from "@/components/CardBetsBoard/CardBetsBoard.vue";
	import FiltersWrapper from "@/components/FiltersWrapper/FiltersWrapper.vue";
	import Filters from "@/components/Filters/Filters.vue";
	import useBetsHelper from "@/modules/useBetsHelper";

	export default {
		components: {
			CardStats,
			CardBetsHelper,
			CardBetsBoard,
			Filters,
			FiltersWrapper
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { loadBetsHelper, betsHelper, getBoardInfo, getBoardInfoH2H, extraInfo, betsHelperResponse } = useBetsHelper(props.matchDetail);
			const { home, away } = props.matchDetail.teams;
			const lastGamesLength = 5;
			const isOpen = ref([]);
			const getSelectedFilter = computed(() => store.getSelectedFilter());

			const { fetch, fetchState } = useFetch(async () => {
				await loadBetsHelper(home, away);
			});

			const openTeamLineup = name => {
				if (isOpen.value.includes(name)) {
					isOpen.value = isOpen.value.filter(name => name != name);
				} else {
					isOpen.value.push(name);
				}
			};

			const getOpenTeamLineup = name => isOpen.value.find(item => item == name);

			fetch();

			watch(
				() => getSelectedFilter.value,
				(newValue, prevValue) => {
					isOpen.value = [];
				}
			);

			return {
				lastGamesLength,
				fetchState,
				betsHelper,
				extraInfo,
				openTeamLineup,
				getOpenTeamLineup,
				getSelectedFilter,
				fetchState,
				betsHelperResponse,
				getBoardInfo,
				getBoardInfoH2H
			};
		}
	};
</script>

<style lang="scss" scoped>
	.matchBetsHelper {
		padding: 24px 16px;

		&__title {
			font-size: 14px;
			font-weight: 600;
			text-transform: uppercase;
			padding: 8px 16px;
			background-color: #dadada;
			grid-column: 1/-1;
		}

		&__item {
			display: grid;
			gap: 24px 0;
			padding-bottom: 24px;
		}

		&__stats {
			padding: 0 10px;
		}
	}
</style>
