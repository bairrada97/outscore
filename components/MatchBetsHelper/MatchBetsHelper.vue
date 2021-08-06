<template>
	<div class="matchBetsHelper">
		<FiltersWrapper v-if="betsHelperResponse.value" :test="betsHelperResponse">
			<Filters title="Overall">
				<div class="matchBetsHelper__overallInfo" v-if="getGeneralInfo">
					<header>
						<img width="32" height="32" :src="matchDetail.teams.home.logo" alt="" />
						<span>Head To Head</span>
						<img width="32" height="32" :src="matchDetail.teams.away.logo" alt="" />
					</header>
					<span></span>
					<div class="matchBetsHelper__overallInfo__content">
						<div class="matchBetsHelper__overallInfo__info" v-for="(generalInfo, index) of getGeneralInfo.matches" :key="index">
							<span class="matchBetsHelper__overallInfo__number">{{ generalInfo.number }}</span>
							<span class="matchBetsHelper__overallInfo__description">{{ generalInfo.description }}</span>
							<span class="matchBetsHelper__overallInfo__percentage">{{ generalInfo.percentage }}%</span>
						</div>
					</div>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('General')" v-if="getSelectedFilter == 'Overall'">
					<CardBetsHelper name="General" :isOpen="getOpenTeamLineup('General') ? 'isOpen' : ''">
						<ul class="matchBetsHelper__list" v-if="getOpenTeamLineup('General')">
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
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('First Half')" v-if="getSelectedFilter == 'Overall'">
					<CardBetsHelper name="First Half" :isOpen="getOpenTeamLineup('First Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('Second half')" v-if="getSelectedFilter == 'Overall'">
					<CardBetsHelper name="Second half" :isOpen="getOpenTeamLineup('Second Half') ? 'isOpen' : ''"> </CardBetsHelper>
				</div>
			</Filters>
			<Filters title="H2H">
				<div class="matchBetsHelper__overallInfo" v-if="getGeneralInfo">
					<header>
						<img width="32" height="32" :src="matchDetail.teams.home.logo" alt="" />
						<span>Head To Head</span>
						<img width="32" height="32" :src="matchDetail.teams.away.logo" alt="" />
					</header>
					<span></span>
					<div class="matchBetsHelper__overallInfo__content" v-if="getGeneralInfo">
						<div class="matchBetsHelper__overallInfo__info" v-for="(generalInfo, index) of getGeneralInfo.matches" :key="index">
							<span class="matchBetsHelper__overallInfo__number">{{ generalInfo.number }}</span>
							<span class="matchBetsHelper__overallInfo__description">{{ generalInfo.description }}</span>
							<span class="matchBetsHelper__overallInfo__percentage">{{ generalInfo.percentage }}%</span>
						</div>
					</div>
				</div>
				<div class="matchBetsHelper__overallInfo__dropdown" @click="openTeamLineup('General')" v-if="getSelectedFilter == 'H2H'">
					<CardBetsHelper name="General" :isOpen="getOpenTeamLineup('General') ? 'isOpen' : ''">
						<ul class="matchBetsHelper__list" v-if="getOpenTeamLineup('General')">
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
			<Filters title="Facts">
				<div class="matchBetsHelper__overallInfo" v-if="getGeneralInfo">
					<header>
						<img width="32" height="32" :src="matchDetail.teams.home.logo" alt="" />
						<span>Head To Head</span>
						<img width="32" height="32" :src="matchDetail.teams.away.logo" alt="" />
					</header>
					<span></span>
					<div class="matchBetsHelper__overallInfo__content" v-if="getGeneralInfo">
						<div class="matchBetsHelper__overallInfo__info" v-for="(generalInfo, index) of getGeneralInfo.matches" :key="index">
							<span class="matchBetsHelper__overallInfo__number">{{ generalInfo.number }}</span>
							<span class="matchBetsHelper__overallInfo__description">{{ generalInfo.description }}</span>
							<span class="matchBetsHelper__overallInfo__percentage">{{ generalInfo.percentage }}%</span>
						</div>
					</div>
				</div>
			</Filters>
		</FiltersWrapper>
	</div>
</template>

<script>
	import { reactive, watch, computed, ref, useFetch } from "@nuxtjs/composition-api";
	import store from "@/store.js";
	import CardStats from "@/components/CardStats/CardStats.vue";
	import CardBetsHelper from "@/components/CardBetsHelper/CardBetsHelper.vue";
	import FiltersWrapper from "@/components/FiltersWrapper/FiltersWrapper.vue";
	import Filters from "@/components/Filters/Filters.vue";
	import useBetsHelper from "@/modules/useBetsHelper";

	export default {
		components: {
			CardStats,
			CardBetsHelper,
			Filters,
			FiltersWrapper
		},
		props: {
			matchDetail: {
				type: Object
			}
		},
		setup(props) {
			const { loadBetsHelper, betsHelper, getGeneralInfo, extraInfo, betsHelperResponse } = useBetsHelper(props.matchDetail);
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
				getGeneralInfo,
				extraInfo,
				openTeamLineup,
				getOpenTeamLineup,
				getSelectedFilter,
				fetchState,
				betsHelperResponse
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

		&__overallInfo {
			background: #797979;
			display: grid;
			padding: 16px;
			color: #fff;
			font-weight: 600;
			gap: 16px 0;
			margin-bottom: 24px;

			header,
			&__content {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			&__info {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 0 8px;
			}

			&__number {
				grid-column: 1;
				grid-row: 1/3;
				background-color: #e9e7e7;
				color: #212121;
				font-weight: 900;
				font-size: 20px;
				align-self: center;
				justify-self: center;
				padding: 5px 10px;
			}

			&__percentage {
				font-weight: 400;
				color: #dcdcdc;
			}

			&__dropdown {
			}
		}
	}
</style>
