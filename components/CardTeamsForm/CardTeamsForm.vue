<template>
	<div class="cardTeamsForm">
		<h3 class="cardTeamsForm__title">Teams Form</h3>
		<div class="cardTeamsForm__container">
			<div class="cardTeamsForm__teamFormContainer" v-for="(form, index) in teamsForm" :key="index">
				<span :class="winCondition == 'W' ? 'cardTeamsForm__teamWon' : winCondition == 'D' ? 'cardTeamsForm__teamDrew' : 'cardTeamsForm__teamLost'" class="cardTeamsForm__teamForm" v-for="(winCondition, index) in form" :key="index">
					{{ winCondition }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { watch, computed } from "@nuxtjs/composition-api";
	import store from "@/store.js";

	export default {
		props: {
			teamsForm: {
				type: Array
			}
		},
		setup(props) {
			return {};
		}
	};
</script>

<style lang="scss" scoped>
	.cardTeamsForm {
		padding: 16px;
		background-color: #f1f1f1;
		&__title {
			color: #797979;
			text-transform: uppercase;
			font-size: 12px;
			font-weight: 600;
		}

		&__container {
			margin-top: 16px;
			display: flex;
			justify-content: space-between;
		}

		&__teamFormContainer {
			display: flex;
			gap: 0 4px;
		}

		&__teamForm {
			display: block;
			width: 22px;
			height: 22px;
			border-radius: 1px;
			font-weight: 600;
			color: #fff;
			text-align: center;
		}

		&__teamWon {
			background: var(--color-primary);
		}

		&__teamDrew {
			background: #797979;
		}

		&__teamLost {
			background: #d26d6d;
		}
	}
</style>
